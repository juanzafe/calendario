import { useEffect, useState } from "react";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    LabelList,
} from "recharts";
import { useIsMobile } from "../hooks/useIsMobile";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useUser } from "reactfire";
import { spanishHolidays2025, spanishHolidays2026, getWorkingDaysWithHolidays } from "./WorkingDaysCounter";

interface DailyData {
    dia: number;
    clases: number;
}

interface MonthlyData {
    mes: string;
    difference: number;
    fill: string;
}

const chartTheme = {
    gridColor: "#e5e7eb",
    axisFont: { fontSize: 12, fontFamily: "Inter, sans-serif" },
    legendFont: { fontSize: 13, fontFamily: "Inter, sans-serif" },
    tooltipStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        border: "1px solid #d1d5db",
        borderRadius: 8,
    },
};

const ClasesChart: React.FC = () => {
    const isMobile = useIsMobile();
    const { data: user } = useUser();
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState<string>("");

    useEffect(() => {
        const loadData = async () => {
            if (!user?.email) return;
            
            try {
                const userEmail = user.email;
                const classesCollectionRef = collection(db, "classespordia", userEmail, "dates");
                const querySnapshot = await getDocs(classesCollectionRef);
                const settingsRef = doc(db, "userSettings", userEmail);
                const settingsSnap = await getDoc(settingsRef);
                
                // Obtener jornada (por defecto completa)
                const jornada = settingsSnap.exists() && settingsSnap.data().jornada 
                    ? settingsSnap.data().jornada 
                    : "completa";

                // Obtener mes actual desde URL params
                const urlParams = new URLSearchParams(window.location.search);
                const year = parseInt(urlParams.get("year") ?? new Date().getFullYear().toString(), 10);
                const month = parseInt(urlParams.get("month") ?? new Date().getMonth().toString(), 10);
                const currentDate = new Date(year, month, 1);
                
                setCurrentMonth(currentDate.toLocaleString("es-ES", { month: "long", year: "numeric" }));

                // Preparar datos diarios del mes actual
                const diasDelMes = new Date(year, month + 1, 0).getDate();
                const dailyClasses: DailyData[] = [];
                
                for (let dia = 1; dia <= diasDelMes; dia++) {
                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
                    const dayDoc = querySnapshot.docs.find(doc => {
                        const data = doc.data();
                        const docDate = data.date.toDate ? data.date.toDate() : new Date(data.date);
                        return docDate.toISOString().split('T')[0] === dateKey;
                    });
                    
                    dailyClasses.push({
                        dia,
                        clases: dayDoc ? dayDoc.data().count : 0
                    });
                }
                
                setDailyData(dailyClasses);

                // Preparar datos mensuales (últimos 6 meses)
                const monthlyCounts: Record<string, number> = {};

                querySnapshot.docs.forEach((docSnap) => {
                    const data = docSnap.data();
                    if (!data.date || typeof data.count !== "number") return;

                    const date = data.date.toDate ? data.date.toDate() : new Date(data.date);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    monthlyCounts[key] = (monthlyCounts[key] || 0) + data.count;
                });

                const now = new Date();
                const months: MonthlyData[] = [];

                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const yearMonth = date.getFullYear();
                    const monthMonth = date.getMonth();
                    const key = `${yearMonth}-${monthMonth}`;
                    const nombreMes = date.toLocaleString("es-ES", { month: "short" }).replace(".", "");
                    
                    const clasesMes = monthlyCounts[key] || 0;
                    
                    // Solo incluir meses donde se han dado clases
                    if (clasesMes === 0) continue;
                    
                    // Obtener vacaciones del mes
                    const holidaysRef = doc(db, "holidaysPerMonth", userEmail);
                    const holidaysSnap = await getDoc(holidaysRef);
                    let vacationDates: string[] = [];
                    
                    if (holidaysSnap.exists()) {
                        const data = holidaysSnap.data();
                        const start = data[`${key}-start`];
                        const end = data[`${key}-end`];
                        
                        if (start && end) {
                            const startDateObj = new Date(start as string);
                            const endDateObj = new Date(end as string);
                            const dates: string[] = [];
                            const tempDate = new Date(startDateObj);
                            while (tempDate <= endDateObj) {
                                const formatted = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
                                dates.push(formatted);
                                tempDate.setDate(tempDate.getDate() + 1);
                            }
                            vacationDates = dates;
                        }
                    }
                    
                    // Usar las vacaciones para calcular días laborables
                    const selectedHolidays = yearMonth === 2026 ? spanishHolidays2026 : spanishHolidays2025;
                    const allWorkingDays = getWorkingDaysWithHolidays(yearMonth, monthMonth, selectedHolidays, vacationDates);
                    
                    // Calcular días transcurridos hasta hoy
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const pastWorkingDays = allWorkingDays.filter((dayStr) => {
                        const dayDate = new Date(dayStr);
                        dayDate.setHours(0, 0, 0, 0);
                        return dayDate <= today;
                    });
                    
                    // Calcular diferencia con respecto a lo que deberías llevar hoy
                    const valorPorDia = jornada === "media" ? 7.8125 : 12.5;
                    const classesShouldHaveByToday = Math.round(pastWorkingDays.length * valorPorDia);
                    const difference = clasesMes - classesShouldHaveByToday;
                    
                    months.push({
                        mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
                        difference: Math.round(difference * 10) / 10,
                        fill: difference >= 0 ? "#10b981" : "#ef4444",
                    });
                }

                setMonthlyData(months);
            } catch (error) {
                console.error("Error cargando datos de gráficas:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    if (loading) {
        return (
            <div className="w-full bg-white rounded-xl shadow-md p-4 border border-gray-200 text-center">
                <p className="text-gray-600 animate-pulse">Cargando gráficas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Gráfica diaria del mes actual */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-emerald-700">
                    Clases por día - {currentMonth}
                </h2>
                <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
                    <ComposedChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                        <XAxis 
                            dataKey="dia" 
                            tick={chartTheme.axisFont}
                            label={{ value: 'Día del mes', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis tick={chartTheme.axisFont} />
                        <Tooltip
                            contentStyle={chartTheme.tooltipStyle}
                            formatter={(value: number) => [`${value} clases`, "Clases"]}
                        />
                        <Legend wrapperStyle={chartTheme.legendFont} />
                        <Line 
                            type="monotone" 
                            dataKey="clases" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            name="Clases del día"
                            dot={{ fill: '#10b981', r: 4 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfica mensual de diferencias */}
            {monthlyData.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-emerald-700">
                        Diferencia vs objetivo (últimos 6 meses)
                    </h2>
                    <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
                        <ComposedChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                            <XAxis dataKey="mes" tick={chartTheme.axisFont} />
                            <YAxis tick={chartTheme.axisFont} />
                            <Tooltip
                                contentStyle={chartTheme.tooltipStyle}
                                formatter={(value: number) => [`${value > 0 ? "+" : ""}${value.toFixed(1)} clases`, "Diferencia"]}
                            />
                            <Legend wrapperStyle={chartTheme.legendFont} />
                            <Bar 
                                dataKey="difference" 
                                name="Diferencia vs objetivo"
                                isAnimationActive={false}
                            >
                                <LabelList
                                    dataKey="difference"
                                    position="top"
                                    formatter={(value: React.ReactNode): React.ReactNode => {
                                        if (typeof value === "number") {
                                            return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
                                        }
                                        
                                        if (typeof value === "string") {
                                            const num = parseFloat(value);
                                            return Number.isNaN(num) ? value : `${num > 0 ? "+" : ""}${num.toFixed(1)}`;
                                        }

                                        return value;
                                    }}
                                    style={{ fontSize: 11, fill: '#374151' }}
                                />
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ClasesChart;
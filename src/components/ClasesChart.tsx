import type React from "react";
import { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ComposedChart,
	Bar,
	ReferenceLine,
} from "recharts";
import { AppContainer } from "./AppContainer";
import { useUser } from "reactfire";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useIsMobile } from "../hooks/useIsMobile";

/* ================================================================
   🔹 Tipado
================================================================ */
interface ClasesChartProps {
	clasesPorDia: { dia: number; total: number; acumuladas?: number }[];
}

/* ================================================================
   🎯 Estilo común (texto y color)
================================================================ */
const chartTheme = {
	gridColor: "#e5e7eb",
	textColor: "#374151",
	axisFont: { fontSize: 12, fontFamily: "Inter, sans-serif" },
	legendFont: { fontSize: 13, fontFamily: "Inter, sans-serif" },
	tooltipStyle: {
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		border: "1px solid #d1d5db",
		borderRadius: 8,
	},
};

/* ================================================================
   📈 Gráfico de clases por día
================================================================ */
export const ClasesChart: React.FC<ClasesChartProps> = ({ clasesPorDia }) => {
	const isMobile = useIsMobile();
	let acumuladas = 0;

	const data = clasesPorDia.map((d) => {
		acumuladas += d.total ?? 0;
		return { dia: d.dia, total: d.total ?? 0, acumuladas };
	});

	return (
		<div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
			<h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-emerald-700">
				Clases diarias y acumuladas
			</h2>

			<ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
				<LineChart
					data={data}
					margin={{
						top: isMobile ? 10 : 20,
						right: isMobile ? 10 : 30,
						bottom: isMobile ? 10 : 20,
						left: isMobile ? 0 : 20,
					}}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke={chartTheme.gridColor}
						vertical={!isMobile}
					/>
					<XAxis
						dataKey="dia"
						tick={chartTheme.axisFont}
						label={
							!isMobile
								? {
										value: "Día del mes",
										position: "insideBottomRight",
										offset: -10,
										style: chartTheme.axisFont,
									}
								: undefined
						}
					/>

					{/* Ocultar eje Y en móvil */}
					{!isMobile && (
						<YAxis
							tick={chartTheme.axisFont}
							label={{
								value: "Número de clases",
								angle: -90,
								position: "insideLeft",
								style: chartTheme.axisFont,
							}}
						/>
					)}

					<Tooltip
						contentStyle={chartTheme.tooltipStyle}
						formatter={(value, name) => {
							if (name === "total") return [value, "Clases por día"];
							if (name === "acumuladas") return [value, "Clases acumuladas"];
							return [value, name];
						}}
						labelFormatter={(label) => `Día ${label}`}
					/>

					{!isMobile && (
						<Legend
							verticalAlign="top"
							height={36}
							wrapperStyle={chartTheme.legendFont}
						/>
					)}

					<Line
						type="monotone"
						dataKey="total"
						stroke="#0ea5e9"
						strokeWidth={2}
						name="Clases por día"
						dot={{ r: isMobile ? 2 : 3 }}
					/>
					<Line
						type="monotone"
						dataKey="acumuladas"
						stroke="#10b981"
						strokeWidth={2}
						name="Clases acumuladas"
						dot={{ r: isMobile ? 2 : 3 }}
						activeDot={{ r: isMobile ? 4 : 5 }}
					/>
				</LineChart>
			</ResponsiveContainer>

			<div className="mt-8 sm:mt-10">
				<MonthlyClassesChart />
			</div>
		</div>
	);
};

/* ================================================================
   📊 Gráfico de barras: Clases por mes + promedio anual
================================================================ */
export const MonthlyClassesChart: React.FC = () => {
	const { data: user } = useUser();
	const isMobile = useIsMobile();
	const [monthlyData, setMonthlyData] = useState<
		{ mes: string; total: number }[]
	>([]);
	const [average, setAverage] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.email) return;

		const loadMonthlyClasses = async () => {
			try {
				const email = user.email ?? "noemail";
				const classesCollectionRef = collection(
					db,
					"classespordia",
					email,
					"dates",
				);
				const querySnapshot = await getDocs(classesCollectionRef);

				const counts: Record<string, number> = {};

				querySnapshot.docs.forEach((docSnap) => {
					const data = docSnap.data();
					if (!data.date || typeof data.count !== "number") return;

					const date = data.date.toDate
						? data.date.toDate()
						: new Date(data.date);
					const key = `${date.getFullYear()}-${date.getMonth()}`;
					counts[key] = (counts[key] || 0) + data.count;
				});

				const now = new Date();
				const months = Array.from({ length: 12 }).map((_, i) => {
					const date = new Date(
						now.getFullYear(),
						now.getMonth() - (11 - i),
						1,
					);
					const key = `${date.getFullYear()}-${date.getMonth()}`;
					const nombreMes = date.toLocaleString("es-ES", { month: "short" });
					return {
						mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
						total: counts[key] || 0,
					};
				});

				const mesesConClases = months.filter((m) => m.total > 0);
				const promedioAnual =
					mesesConClases.length > 0
						? mesesConClases.reduce((acc, m) => acc + m.total, 0) /
							mesesConClases.length
						: 0;

				setMonthlyData(months);
				setAverage(promedioAnual);
			} catch (error) {
				console.error("Error al cargar clases mensuales:", error);
			} finally {
				setLoading(false);
			}
		};

		loadMonthlyClasses();
	}, [user]);

	if (loading) {
		return (
			<div className="w-full bg-white rounded-xl shadow-md p-4 border border-gray-200 text-center">
				<p className="text-gray-600 animate-pulse">
					Cargando clases mensuales...
				</p>
			</div>
		);
	}

	return (
		<div className="mt-8 sm:mt-10">
			<h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-emerald-700">
				Clases totales por mes
			</h2>

			<ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
				<ComposedChart
					data={monthlyData}
					margin={{
						top: isMobile ? 10 : 20,
						right: isMobile ? 10 : 30,
						left: isMobile ? 0 : 20,
						bottom: 20,
					}}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke={chartTheme.gridColor}
						vertical={!isMobile}
					/>
					<XAxis dataKey="mes" tick={chartTheme.axisFont} />

					{!isMobile && (
						<YAxis
							tick={chartTheme.axisFont}
							label={{
								value: "Clases",
								angle: -90,
								position: "insideLeft",
								style: chartTheme.axisFont,
							}}
						/>
					)}

					<Tooltip
						contentStyle={chartTheme.tooltipStyle}
						formatter={(value) => [`${value} clases`, "Total del mes"]}
						labelFormatter={(label) => `Mes: ${label}`}
					/>

					{!isMobile && (
						<Legend
							verticalAlign="top"
							height={36}
							wrapperStyle={chartTheme.legendFont}
						/>
					)}

					<Bar
						dataKey="total"
						name="Clases totales"
						fill="#10b981"
						radius={[6, 6, 0, 0]}
					/>

					{!isMobile && average !== null && average > 0 && (
						<ReferenceLine
							y={average}
							label={{
								value: `Promedio anual: ${average.toFixed(1)} clases`,
								position: "top",
								fill: "#374151",
								fontSize: 12,
								fontFamily: "Inter, sans-serif",
							}}
							stroke="#3b82f6"
							strokeDasharray="4 4"
							strokeWidth={2}
						/>
					)}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

/* ================================================================
   🔹 Página contenedora
================================================================ */
export function ClasesChartPage() {
	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-emerald-50">
			<AppContainer showOnlyChart />
		</div>
	);
}

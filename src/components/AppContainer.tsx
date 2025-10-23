import { useEffect, useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";
import { useUser } from "reactfire";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { ClasesChart } from "./ClasesChart";
import {
  BarChart3,
  LogOut as LogOutIcon,
  User,
  Mail,
  ArrowLeft,
} from "lucide-react";

interface AppContainerProps {
  showOnlyChart?: boolean;
}

export function AppContainer({ showOnlyChart = false }: AppContainerProps) {
  const { data: user } = useUser();
  const [calendario, setCalendario] = useState(new CalendarioAutoescuela());
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const year = parseInt(params.get("year") ?? "");
    const month = parseInt(params.get("month") ?? "");
    if (!isNaN(year) && !isNaN(month)) {
      setCurrentDate(new Date(year, month, 1));
    }
  }, [params]);

  useEffect(() => {
    if (!user) return;
    const classesCollectionRef = collection(
      db,
      "classespordia",
      "email",
      user.email ?? "noemail"
    );
    getDocs(classesCollectionRef).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const updatedCalendar = calendario.setClassCounter(
          new Date(data.date),
          data.count
        );
        setCalendario(updatedCalendar);
      });
    });
  }, [user]);

  const diasDelMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const clasesPorDia = Array.from({ length: diasDelMes }, (_, i) => {
    const dia = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      i + 1
    );
    return {
      dia: i + 1,
      total: calendario.calculateClassesForDate(dia),
    };
  });

  const LogOut = () => (
    <Button
      variant="outlined"
      color="error"
      startIcon={<LogOutIcon size={18} />}
      onClick={() => auth.signOut()}
      sx={{
        marginTop: 3,
        borderRadius: 4,
        textTransform: "none",
        fontWeight: 500,
      }}
    >
      Cerrar sesión
    </Button>
  );

  // 🔹 Vista: solo gráfica
  if (showOnlyChart) {
    const nombreMes = currentDate.toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={22} className="text-emerald-700" />
          <h1 className="text-2xl font-semibold">
            Gráfica de clases – {nombreMes}
          </h1>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-xl shadow p-4 border border-gray-200">
          <ClasesChart clasesPorDia={clasesPorDia} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/admin")}
            sx={{
              textTransform: "none",
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            Volver al calendario
          </Button>
          <LogOut />
        </div>
      </div>
    );
  }

  // 🔹 Vista principal del calendario
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-800 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-left">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <User size={18} />
              <span>{user?.displayName || "Invitado"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail size={16} />
              <span>{user?.email || "Sin correo"}</span>
            </div>
          </div>

          <LogOut />
        </div>

        <Month
          calendario={calendario}
          addClass={(day) => {
            const updated = calendario.addClass(day);
            setCalendario(updated);
          }}
          removeClass={(day) => {
            const updated = calendario.removeClass(day);
            setCalendario(updated);
          }}
          resetClass={(day) => {
            const updated = calendario.resetClass(day);
            setCalendario(updated);
          }}
          onMonthChange={(date) => setCurrentDate(date)}
        />

        <div className="flex justify-center mt-6">
          <Button
            variant="contained"
            color="primary"
            startIcon={<BarChart3 size={18} />}
            onClick={() =>
              navigate(
                `/admin/grafica?year=${currentDate.getFullYear()}&month=${currentDate.getMonth()}`
              )
            }
            sx={{
              borderRadius: 4,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Ver gráfica de clases
          </Button>
        </div>
      </div>
    </div>
  );
}

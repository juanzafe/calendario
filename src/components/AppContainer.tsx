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
  const [showSettings, setShowSettings] = useState(false);

  
  const [jornada, setJornada] = useState<"media" | "completa">(
    () => (localStorage.getItem("jornada") as "media" | "completa") || "media"
  );

  useEffect(() => {
    localStorage.setItem("jornada", jornada);
  }, [jornada]);

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
        borderRadius: 4,
        textTransform: "none",
        fontWeight: 500,
        height: "38px",
        padding: "0 12px",
        marginTop: 0,
      }}
    >
      Cerrar sesión
    </Button>
  );

  
  if (showOnlyChart) {
    const nombreMes = currentDate.toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="min-h-screen w-screen bg-gradient-to-b from-gray-50 to-emerald-50 text-gray-800 overflow-y-auto px-6 sm:px-12 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={28} className="text-emerald-700" />
            <h1 className="text-3xl font-semibold">
              Gráfica de clases – {nombreMes}
            </h1>
          </div>

          <div className="flex flex-row flex-wrap items-center justify-end gap-3 mt-2 sm:mt-0">
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/admin")}
              sx={{
                textTransform: "none",
                borderRadius: 4,
                fontWeight: 500,
                height: "40px",
                minWidth: "180px",
              }}
            >
              Volver al calendario
            </Button>
            <LogOut />
          </div>
        </div>

        <div className="w-full bg-white rounded-xl shadow p-6 border border-gray-200">
          <ClasesChart clasesPorDia={clasesPorDia} />
        </div>
      </div>
    );
  }

  
  return (
    <div className="w-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-y-auto px-6 sm:px-12 pt-4 pb-6">
      
      <header className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-5 text-emerald-700 font-semibold text-lg">
          <User size={22} />
          <span>{user?.displayName || "Invitado"}</span>
          <img
            src="https://quefranquicia.com/sitepanel/wp-content/uploads/2021/11/logo-TORCAL-AUTOESCUELAS.png"
            alt="Logo Torcal Autoescuelas"
            className="w-[400px] h-[180px] object-fill"
          />
        </div>

        <div className="flex flex-row flex-wrap items-center justify-end gap-4">

          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Mail size={16} />
            <span>{user?.email || "Sin correo"}</span>
          </div>

          <LogOut />
        </div>
      </header>


   

      
      <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full">
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
          jornada={jornada}
        />
      </section>

      
      <div className="flex justify-center mt-8">
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
            px: 3,
            py: 1,
          }}
        >
          Ver gráfica de clases
        </Button>
      </div>
    </div>
  );
}

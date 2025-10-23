
import { useEffect, useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";
import { useUser } from "reactfire";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { ClasesChart } from "./ClasesChart";

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
    const dia = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return {
      dia: i + 1,
      total: calendario.calculateClassesForDate(dia),
    };
  });

  const LogOut = () => (
    <Button
      variant="outlined"
      color="error"
      onClick={() => auth.signOut()}
      sx={{ marginTop: 3 }}
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
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>📊 Gráfica de clases - {nombreMes}</h1>
        <ClasesChart clasesPorDia={clasesPorDia} />
        <Button
          variant="outlined"
          onClick={() => navigate("/admin")}
          sx={{ marginTop: 3 }}
        >
          ⬅️ Volver al calendario
        </Button>
        <LogOut />
      </div>
    );
  }

  // 🔹 Vista del calendario
  return (
    <div className="AppContainer" style={{ textAlign: "center", padding: "2rem" }}>
      <p>
        Bienvenido, <strong>{user?.displayName || "Guest"}</strong>!
      </p>
      <p>Email: {user?.email || "No proporcionado"}</p>

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

      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          navigate(
            `/admin/grafica?year=${currentDate.getFullYear()}&month=${currentDate.getMonth()}`
          )
        }
        sx={{ marginTop: 3 }}
      >
        📈 Ver gráfica de clases
      </Button>

      <LogOut />
    </div>
  );
}

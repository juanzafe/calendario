<<<<<<< HEAD

=======
>>>>>>> 68ef435
import { useEffect, useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";
import { useUser } from "reactfire";
<<<<<<< HEAD
import { saveClass, deleteClass, listenToClasses } from "../services/calendarService";

export function AppContainer() {
  const { data: user } = useUser();
  const [calendario, setCalendario] = useState<CalendarioAutoescuela>(
    new CalendarioAutoescuela()
  );

  // 🔄 Recuperar calendario del usuario
  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToClasses((classes) => {
      const nuevoCalendario = new CalendarioAutoescuela();
      classes.forEach((cls: any) => {
        nuevoCalendario.addClass(new Date(cls.date));
      });
      setCalendario(nuevoCalendario);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="AppContainer">
      <p>bienvenido, {user?.displayName || "Guest"}!</p>
      <p>Email: {user?.email || "Not provided"}</p>

      <Month
        calendario={calendario}
        addClass={async (day) => {
          const updatedCalendario = calendario.addClass(day);
          setCalendario(updatedCalendario);

          await saveClass(day, { title: "Clase", count: 1 });
        }}
        removeClass={async (day) => {
          const updatedCalendario = calendario.removeClass(day);
          setCalendario(updatedCalendario);

          await deleteClass(day); // 🔥 borrar también en Firestore
        }}
        resetClass={async (day) => {
          const updatedCalendario = calendario.resetClass(day);
          setCalendario(updatedCalendario);

          await saveClass(day, { title: "Clase reseteada", count: 0 }); // 🔥 reset en Firestore
        }}
      />

      <main>
        <Contador calendario={calendario} />
        <DiasLaborales calendario={calendario} />
      </main>
    </div>
  );
}

interface ContadorProps {
  calendario: CalendarioAutoescuela;
}
function Contador(props: ContadorProps) {
  return <div>{props.calendario.totalNumberOfClasses()}</div>;
}

function DiasLaborales(props: ContadorProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>(undefined);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumber(Number(event.target.value));
  };

  return (
    <div>
      <label htmlFor="number-select">Dias laborables este mes:</label>
      <select id="number-select" value={selectedNumber ?? ""} onChange={handleChange}>
        <option value="" disabled>
          Elige un número
        </option>
        {[...Array(25)].map((_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>

      {selectedNumber && <p>objetivo del mes :{Math.round(selectedNumber * 7.8125)}</p>}
=======
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
        onMonthChange={(date) => setCurrentDate(date)} // ✅ sincronización
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
>>>>>>> 68ef435
    </div>
  );
}


import { useEffect, useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";
import { useUser } from "reactfire";
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
    </div>
  );
}

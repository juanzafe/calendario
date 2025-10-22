import { useState, useEffect } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";
import { Contador } from "./Contador";
import WorkingDaysCounter from "./WorkingDays";

export interface CalendarioAutoescuelaProps {
  calendario: CalendarioAutoescuela;
  addClass: (day: Date) => void;
  removeClass: (day: Date) => void;
  resetClass: (day: Date) => void;
  onMonthChange?: (date: Date) => void; 
}

export function Month(props: CalendarioAutoescuelaProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clasesDelMes, setClasesDelMes] = useState(0);

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  
  useEffect(() => {
    props.onMonthChange?.(currentDate);
  }, [currentDate]);

  const nombreMes = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const diasDelMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const clasesPorDia = Array.from({ length: diasDelMes }, (_, i) => {
    const dia = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return {
      dia: i + 1,
      total: props.calendario.totalNumberOfClasses(dia),
    };
  });

  return (
    <div className="month-container" style={{ textAlign: "center" }}>
      <div
        className="month-header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button onClick={handlePreviousMonth}>⬅️</button>
        <h1 style={{ textTransform: "capitalize", margin: "0" }}>{nombreMes}</h1>
        <button onClick={handleNextMonth}>➡️</button>
      </div>

      <MonthHeader {...props} />
      <DaysContainer {...props} currentDate={currentDate} />
      <Contador
        calendario={props.calendario}
        currentDate={currentDate}
        onChange={setClasesDelMes}
      />
      <WorkingDaysCounter
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        clasesDelMesVisible={clasesDelMes}
      />
    </div>
  );
}

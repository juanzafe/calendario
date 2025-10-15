import { useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";

export interface CalendarioAutoescuelaProps {
  calendario: CalendarioAutoescuela;
  addClass: (day: Date) => void;
  removeClass: (day: Date) => void;
  resetClass: (day: Date) => void;
}

export function Month(props: CalendarioAutoescuelaProps) {
  
  const [currentDate, setCurrentDate] = useState(new Date());

  
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

  
  const nombreMes = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="month-container" style={{ textAlign: "center" }}>
    
      <div className="month-header" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
        <button onClick={handlePreviousMonth}>⬅️</button>
        <h1 style={{ textTransform: "capitalize", margin: "0" }}>{nombreMes}</h1>
        <button onClick={handleNextMonth}>➡️</button>
      </div>

      <MonthHeader {...props} />
      <DaysContainer {...props} />
    </div>
  );
}

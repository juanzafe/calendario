import { useState, useEffect } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";
import { Contador } from "./Contador";
import WorkingDaysCounter from "./WorkingDays";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 text-gray-900 overflow-hidden">
      {/* Header del mes */}
      <div className="flex justify-between items-center px-4 py-2 bg-emerald-700 text-white text-lg font-medium shadow-sm">
        <button
          onClick={handlePreviousMonth}
          className="p-1.5 hover:bg-emerald-600 rounded-full transition"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        <h1 className="capitalize tracking-wide text-center">{nombreMes}</h1>

        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-emerald-600 rounded-full transition"
        >
          <ArrowRight size={18} className="text-white" />
        </button>
      </div>

      {/* Encabezado de días */}
      <div className="flex-shrink-0">
        <MonthHeader {...props} />
      </div>

      {/* Días del mes */}
      <div className="flex-grow w-full">
        <DaysContainer {...props} currentDate={currentDate} />
      </div>

      {/* Contadores */}
      <div className="bg-white text-sm py-2 px-3 border-t border-gray-200">
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
    </div>
  );
}

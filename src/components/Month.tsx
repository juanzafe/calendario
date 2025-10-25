import { useState, useEffect } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import WorkingDaysCounter from "./WorkingDaysCounter";

export interface CalendarioAutoescuelaProps {
  calendario: CalendarioAutoescuela;
  addClass: (day: Date) => void;
  removeClass: (day: Date) => void;
  resetClass: (day: Date) => void;
  onMonthChange?: (date: Date) => void;
  jornada?: "media" | "completa";
}

export function Month(props: CalendarioAutoescuelaProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clasesDelMes, setClasesDelMes] = useState(0);

  
  const [jornada, setJornada] = useState<"media" | "completa">(
    () => (localStorage.getItem("jornada") as "media" | "completa") || "media"
  );

  useEffect(() => {
    localStorage.setItem("jornada", jornada);
  }, [jornada]);

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
    const clasesMes = props.calendario.totalNumberOfClassesInMonth(currentDate);
    setClasesDelMes(clasesMes);
  }, [currentDate, props.calendario]);

  const nombreMes = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-emerald-50 to-white text-gray-900 rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
      
      {/* 🔹 HEADER DEL MES */}
      <div className="flex justify-between items-center px-4 py-2 bg-emerald-100 text-emerald-800 border-b border-emerald-200">
        <button
          onClick={handlePreviousMonth}
          className="p-1.5 hover:bg-emerald-200 rounded-full transition"
          title="Mes anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2 select-none">
          <Calendar size={18} className="text-emerald-700" />
          <h1 className="capitalize tracking-wide text-lg font-semibold">
            {nombreMes}
          </h1>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-emerald-200 rounded-full transition"
          title="Mes siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 🔹 CABECERA DE DÍAS */}
      <div className="flex-shrink-0">
        <MonthHeader {...props} />
      </div>

      {/* 🔹 CONTENEDOR DE DÍAS */}
      <div className="flex-grow w-full">
        <DaysContainer
          {...props}
          currentDate={currentDate}
          jornada={jornada}
        />
      </div>

      {/* 🔹 PIE CON RESUMEN */}
      <div className="bg-white border-t border-gray-200 py-3 px-4">
        <WorkingDaysCounter
          year={currentDate.getFullYear()}
          month={currentDate.getMonth()}
          clasesDelMesVisible={clasesDelMes}
          jornada={jornada}
          setJornada={setJornada} 
        />
      </div>
    </div>
  );
}

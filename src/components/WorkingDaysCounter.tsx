import React, { useState, useEffect } from "react";

import {
  CalendarDays,
  Sun,
  Target,
  ClipboardList,
  GraduationCap,
  Clock,
  Flag,
} from "lucide-react";
import { motion } from "framer-motion";
import VacacionesYJornada from "./VacacionesYJornada";
import ReactConfetti from "react-confetti";

export const spanishHolidays2025: string[] = [
  "2025-01-01",
  "2025-01-06",
  "2025-02-28",
  "2025-04-17",
  "2025-04-18",
  "2025-05-01",
  "2025-08-15",
  "2025-10-13",
  "2025-11-01",
  "2025-12-06",
  "2025-12-08",
  "2025-12-25",
  "2025-08-19",
  "2025-09-08",
  "2025-12-24",
  "2025-12-31",
];

export const spanishHolidays2026: string[] = [
  "2026-01-01", // Año Nuevo
  "2026-01-06", // Epifanía del Señor
  "2026-02-28", // Día de Andalucía
  "2026-04-02", // Jueves Santo
  "2026-04-03", // Viernes Santo
  "2026-05-01", // Fiesta del Trabajo
  "2026-08-15", // Asunción de la Virgen
  "2026-08-19", // Fiesta local: incorporación de Málaga a la Corona de Castilla
  "2026-09-08", // Fiesta local: Virgen de la Victoria
  "2026-10-12", // Fiesta Nacional de España
  "2026-11-02", // Día de Todos los Santos (traslado al lunes)
  "2026-12-07", // Día de la Constitución (traslado al lunes)
  "2026-12-08", // Inmaculada Concepción
  "2026-12-25", // Navidad
];

export function getWorkingDaysWithHolidays(
  year: number,
  month: number,
  holidays: string[] = []
): string[] {
  const workingDays: string[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formatted)) {
      workingDays.push(formatted);
    }
  }

  return workingDays;
}

interface WorkingDaysCounterProps {
  year: number;
  month: number;
  holidays?: string[];
  clasesDelMesVisible: number;
  jornada: "media" | "completa";
  setJornada: (value: "media" | "completa") => void;
  vacationNumber: number;
  onVacationChange: (days: number) => void;
}

const WorkingDaysCounter: React.FC<WorkingDaysCounterProps> = ({
  year,
  month,
  holidays,
  clasesDelMesVisible,
  jornada,
  setJornada,
  vacationNumber,
  onVacationChange,
}) => {
  const selectedHolidays =
    holidays ?? (year === 2026 ? spanishHolidays2026 : spanishHolidays2025);

  const [workingDays, setWorkingDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const allWorkingDays = getWorkingDaysWithHolidays(year, month, selectedHolidays);
    setWorkingDays(allWorkingDays.length);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const remaining = allWorkingDays.filter((dayStr) => {
      const dayDate = new Date(dayStr);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate > today;
    });

    setRemainingDays(remaining.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, holidays, jornada]);

  const valorPorDia = jornada === "media" ? 7.8125 : 12.5;

  const adjustedDays = Math.max(workingDays - vacationNumber, 0);
  const adjustedRemaining = Math.max(remainingDays - vacationNumber, 0);
  const adjustedClassesNeeded =
    Math.round(adjustedDays * valorPorDia) - clasesDelMesVisible;
  const adjustedClassesPerDay = (adjustedClassesNeeded / adjustedRemaining).toFixed(2)

  useEffect(() => {
    if (adjustedClassesNeeded <= 0 && workingDays > 0) {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 5000);
      return () => {
        setShowFireworks(false);
        clearTimeout(timer);
      };
    }
    return () => setShowFireworks(false);
  }, [adjustedClassesNeeded, workingDays, month]);

  const pastWorkingDays = adjustedDays - adjustedRemaining;
  const classesShouldHaveByToday = Math.round(pastWorkingDays * valorPorDia);
  const differenceWithToday = clasesDelMesVisible - classesShouldHaveByToday;

  const cardBase =
    "bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm flex flex-col text-sm";

  return (
    <>
      {showFireworks && <ReactConfetti />}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 w-full justify-between
    landscape:flex-col"
      >
        
        <div className="flex-1">
          <div className={cardBase}>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
              <ClipboardList size={16} />
              <span>Resumen del mes</span>
            </div>
            <div className="bg-white rounded-md border border-gray-200 p-3 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-gray-700">
                  <GraduationCap size={15} className="text-emerald-600" /> Clases dadas:
                </span>
                <strong>{clasesDelMesVisible}</strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-gray-700">
                  <CalendarDays size={15} className="text-emerald-600" /> Días laborables:
                </span>
                <strong>{adjustedDays}</strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-gray-700">
                  <Sun size={15} className="text-emerald-600" /> Días restantes:
                </span>
                <strong>{adjustedRemaining}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div className="flex-1">
          <div className={cardBase}>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
              <Target size={16} />
              <span>Objetivos</span>
            </div>
            <div className="bg-white rounded-md border border-gray-200 p-3 text-sm space-y-1.5">
              <div className="flex justify-between border-gray-200">
                <span className="flex items-center gap-1 text-gray-700">
                  <Flag size={15} className="text-emerald-600" /> ¿Cómo vas?:
                </span>
                <strong
                  className={
                    differenceWithToday > 0
                      ? "text-green-600"
                      : differenceWithToday < 0
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                >
                  {clasesDelMesVisible === 0
    				? "-"
    				: differenceWithToday > 0
    				? `+${differenceWithToday} ${differenceWithToday === 1 ? "clase" : "clases"} por encima`
    				: differenceWithToday < 0
    				? `${differenceWithToday} ${differenceWithToday === -1 ? "clase" : "clases"} por debajo`
    				: `al día`}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-gray-700">
                  <Target size={15} className="text-emerald-600" /> Clases objetivo:
                </span>
                <strong>{Math.round(adjustedDays * valorPorDia)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-gray-700">
                  <CalendarDays size={15} className="text-emerald-600" /> Faltan:
                </span>
                <strong>{adjustedClassesNeeded > 0 ?
                  adjustedClassesNeeded:
                  "Ya llegaste!"}</strong>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-gray-700">
                  <Clock size={15} className="text-emerald-600" /> Clases por día necesarias:
                </span>
                <strong>{Number(adjustedClassesPerDay) > 0 ?
                  adjustedClassesPerDay : 
                  "-"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Vacaciones y jornada */}
        <div className="flex-1">
          <VacacionesYJornada
            workingDays={workingDays}
            jornada={jornada}
            setJornada={setJornada}
            onVacationChange={onVacationChange}
            vacationNumber={vacationNumber}
          />
        </div>
      </motion.div>
    </>
  );
};

export default WorkingDaysCounter;

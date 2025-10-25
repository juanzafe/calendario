import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Sun,
  Target,
  ClipboardList,
  Plane,
  GraduationCap,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const spanishHolidays2025: string[] = [
  "2025-01-01", "2025-01-06", "2025-02-28", "2025-04-17", "2025-04-18",
  "2025-05-01", "2025-08-15", "2025-10-13", "2025-11-01", "2025-12-06",
  "2025-12-08", "2025-12-25", "2025-08-19", "2025-09-08",
];

export function getWorkingDaysWithHolidays(
  year: number,
  month: number,
  holidays: string[] = []
): string[] {
  const workingDays: string[] = [];
  const date = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    date.setDate(day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const formatted = date.toISOString().split("T")[0];
      if (!holidays.includes(formatted)) workingDays.push(formatted);
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
}

const WorkingDaysCounter: React.FC<WorkingDaysCounterProps> = ({
  year,
  month,
  holidays = spanishHolidays2025,
  clasesDelMesVisible,
  jornada,
}) => {
  const [workingDays, setWorkingDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [vacationDays, setVacationDays] = useState(0);

  useEffect(() => {
    const allWorkingDays = getWorkingDaysWithHolidays(year, month, holidays);
    setWorkingDays(allWorkingDays.length);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const remaining = allWorkingDays.filter((dayStr) => {
      const dayDate = new Date(dayStr);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate >= today;
    });

    setRemainingDays(remaining.length);
  }, [year, month, holidays]);

  const handleVacationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVacationDays(Number(e.target.value));
  };

 
  const valorPorDia = jornada === "media" ? 7.8125 : 12.5;

  const adjustedDays = Math.max(workingDays - vacationDays, 0);
  const adjustedRemaining = Math.max(remainingDays - vacationDays, 0);
  const adjustedClassesNeeded =
    Math.round(adjustedDays * valorPorDia) - clasesDelMesVisible;
  const adjustedClassesPerDay =
    adjustedRemaining > 0
      ? (adjustedClassesNeeded / adjustedRemaining).toFixed(2)
      : "0";

  const cardBase =
    "bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm flex flex-col text-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 w-full justify-between"
    >
      {/* 📋 RESUMEN DEL MES */}
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

      {/* 🎯 OBJETIVOS */}
      <div className="flex-1">
        <div className={cardBase}>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
            <Target size={16} />
            <span>Objetivos</span>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-3 text-sm space-y-1.5">
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
              <strong>{adjustedClassesNeeded}</strong>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-gray-700">
                <Clock size={15} className="text-emerald-600" /> Clases por día necesarias:
              </span>
              <strong>{adjustedClassesPerDay}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ✈️ VACACIONES */}
      <div className="flex-1">
        <div className={cardBase}>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
            <Plane size={16} />
            <span>Vacaciones</span>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-3 flex justify-between items-center">
            <span className="text-gray-700">
              Días: <strong>{vacationDays}</strong>
            </span>
            <select
              id="vacation-select-compact"
              value={vacationDays}
              onChange={handleVacationChange}
              className="border border-emerald-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {[...Array(workingDays + 1)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkingDaysCounter;

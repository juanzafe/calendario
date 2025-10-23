import React, { useState, useEffect } from "react";
import { CalendarDays, Sun, Target, ClipboardList, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";

const spanishHolidays2025: string[] = [
  "2025-01-01", "2025-01-06", "2025-02-28", "2025-04-17", "2025-04-18",
  "2025-05-01", "2025-08-15", "2025-10-13", "2025-11-01", "2025-12-06",
  "2025-12-08", "2025-12-25", "2025-08-19", "2025-09-08",
];

// 🔹 Devuelve los días laborables del mes (excluyendo festivos y fines de semana)
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
      if (!holidays.includes(formatted)) {
        workingDays.push(formatted);
      }
    }
  }

  return workingDays;
}

interface WorkingDaysCounterProps {
  year: number;
  month: number;
  holidays?: string[];
  clasesDelMesVisible: number;
}

const WorkingDaysCounter: React.FC<WorkingDaysCounterProps> = ({
  year,
  month,
  holidays = spanishHolidays2025,
  clasesDelMesVisible,
}) => {
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [vacationDays, setVacationDays] = useState<number>(0);

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
    setVacationDays(0);
  }, [year, month, holidays]);

  const handleVacationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setVacationDays(Number(event.target.value));
  };

  const adjustedDays = Math.max(workingDays - vacationDays, 0);
  const adjustedRemaining = Math.max(remainingDays - vacationDays, 0);
  const adjustedClassesNeeded =
    Math.round(adjustedDays * 7.8125) - clasesDelMesVisible;
  const adjustedClassesPerDay =
    adjustedRemaining > 0
      ? (adjustedClassesNeeded / adjustedRemaining).toFixed(2)
      : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm p-4 mt-4 text-gray-800"
    >
      <h2 className="flex items-center gap-2 text-emerald-800 font-semibold text-lg mb-3">
        <ClipboardList size={20} />
        Resumen del mes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
          <CalendarDays size={18} className="text-emerald-600" />
          <span>
            Días laborables: <strong>{adjustedDays}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
          <Sun size={18} className="text-emerald-600" />
          <span>
            Días restantes: <strong>{adjustedRemaining}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
          <Target size={18} className="text-emerald-600" />
          <span>
            Objetivo: <strong>{Math.round(adjustedDays * 7.8125)} clases</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
          <CalendarDays size={18} className="text-emerald-600" />
          <span>
            Faltan: <strong>{adjustedClassesNeeded}</strong> clases
          </span>
        </div>

        <div className="col-span-1 sm:col-span-2 flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
          <span>
            Clases necesarias por día:{" "}
            <strong>{adjustedClassesPerDay}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Plane size={18} className="text-emerald-600" />
            <label htmlFor="vacation-select" className="text-gray-700 text-sm">
              Vacaciones:
            </label>
            <select
              id="vacation-select"
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

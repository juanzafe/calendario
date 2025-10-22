import React, { useState, useEffect } from "react";

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

    // 🔹 Normaliza la fecha actual para incluir el día de hoy si aplica
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔹 Contar días laborables desde hoy (inclusive)
    const remaining = allWorkingDays.filter((dayStr) => {
      const dayDate = new Date(dayStr);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate >= today;
    });

    setRemainingDays(remaining.length);
    setVacationDays(0);
  }, [year, month, holidays]);

  // 🔹 Ajustes por vacaciones
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
    <div
      style={{
        marginTop: "1rem",
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <p>
        Días laborables este mes: <strong>{adjustedDays}</strong>
      </p>
      <p>
        Días laborables restantes: <strong>{adjustedRemaining}</strong>
      </p>
      <p>
        Objetivo del mes: <strong>{Math.round(adjustedDays * 7.8125)}</strong>
      </p>
      <p>
        Clases necesarias restantes: <strong>{adjustedClassesNeeded}</strong>
      </p>
      <p>
        Clases por día para llegar al objetivo:{" "}
        <strong>{adjustedClassesPerDay}</strong>
      </p>

      <label htmlFor="vacation-select">Días de vacaciones:</label>
      <select
        id="vacation-select"
        value={vacationDays}
        onChange={handleVacationChange}
        style={{ marginLeft: "0.5rem" }}
      >
        {[...Array(workingDays + 1)].map((_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WorkingDaysCounter;

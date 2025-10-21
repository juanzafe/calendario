import React, { useState, useEffect } from "react";



const spanishHolidays2025: string[] = [
  // Festivos Nacionales / Andalucía
  "2025-01-01", // Año Nuevo
  "2025-01-06", // Reyes
  "2025-02-28", // Día de Andalucía
  "2025-04-17", // Jueves Santo
  "2025-04-18", // Viernes Santo
  "2025-05-01", // Fiesta del Trabajo
  "2025-08-15", // Asunción de la Virgen
  "2025-10-13", // Fiesta Nacional de España (trasladada)
  "2025-11-01", // Todos los Santos
  "2025-12-06", // Constitución Española
  "2025-12-08", // Inmaculada Concepción
  "2025-12-25", // Navidad

  // Festivos locales Málaga
  "2025-08-19", // Toma de Málaga
  "2025-09-08", // Virgen de la Victoria
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
}

const WorkingDaysCounter: React.FC<WorkingDaysCounterProps> = ({ year, month, holidays= [] }) => {
  const [workingDays, setWorkingDays] = useState<number>(0);

  useEffect(() => {
    const result = getWorkingDaysWithHolidays(year, month, spanishHolidays2025);
    setWorkingDays(result.length);
  }, [year, month]);

  return (
    <div>
        Días laborables este mes: <strong>{workingDays}</strong>
        <br />

        objetivo del mes :{Math.round(workingDays * 7.8125)}
    </div>
    
    
  );
};

export default WorkingDaysCounter;

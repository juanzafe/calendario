import { useEffect } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";

interface ContadorProps {
  calendario: CalendarioAutoescuela;
  currentDate: Date;
  onChange?: (clases: number) => void;
}

export function Contador({ calendario, currentDate, onChange }: ContadorProps) {
  const mesVisible = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const clasesDelMesVisible = calendario.totalNumberOfClassesInMonth(mesVisible);

  
  useEffect(() => {
    onChange?.(clasesDelMesVisible);
  }, [clasesDelMesVisible, onChange]);

  return <div>{clasesDelMesVisible} clases este mes</div>;
}


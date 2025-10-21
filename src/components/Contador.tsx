import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";

interface ContadorProps{
  calendario: CalendarioAutoescuela;
  currentDate: Date;
  
}



export function Contador({calendario, currentDate}: ContadorProps) {
  
  const mesVisible = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const clasesDelMesVisible = calendario.totalNumberOfClassesInMonth(mesVisible);
  
  return (
    <div>
      {clasesDelMesVisible} clases este mes
    </div>
  );
}
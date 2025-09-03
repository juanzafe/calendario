import { Day } from "./Day";
import { CalendarioAutoescuelaProps } from "./Month";

export function   DaysContainer (props: CalendarioAutoescuelaProps){
    const daysPerMonth = getCalendarGrid();
    const daysComponents = daysPerMonth.map((day) => {
        return <Day num={day} calendarioAutoescuelaProps={props}/>
    });
    return (
        <div className="DaysContainer">
            {daysComponents}
        </div>

    )

}



function getCalendarGrid(date: Date = new Date()): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
  
    // Primer día del mes actual
    const firstDayOfMonth = new Date(year, month, 1);
    // Día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
    let startDay = firstDayOfMonth.getDay();
  
    // Ajuste para que la semana comience en lunes (0 = lunes, ..., 6 = domingo)
    startDay = (startDay + 6) % 7;
  
    // Número de días en el mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    
    // Total de celdas en la cuadrícula del calendario
    const totalCells = 35;
  
    // Número de días del mes anterior que necesitamos para rellenar el principio
    const prevMonthDays = startDay;
  
    // Número de días del mes siguiente que necesitamos para completar las 42 celdas
    const nextMonthDays = totalCells - (prevMonthDays + daysInMonth);
  
    const grid: Date[] = [];
  
    // Días del mes anterior
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      grid.push(new Date(year, month, -i));
    }
  
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(new Date(year, month, i));
    }
  
    // Días del mes siguiente
    for (let i = 1; i <= nextMonthDays; i++) {
      grid.push(new Date(year, month + 1, i));
    }
  
    return grid;
  }
  

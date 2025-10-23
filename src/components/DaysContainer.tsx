import { Day } from "./Day";
import { CalendarioAutoescuelaProps } from "./Month";

interface DaysContainerProps {
  currentDate: Date;
  calendario: CalendarioAutoescuelaProps["calendario"];
  addClass: CalendarioAutoescuelaProps["addClass"];
  removeClass: CalendarioAutoescuelaProps["removeClass"];
  resetClass: CalendarioAutoescuelaProps["resetClass"];
}

export function DaysContainer(props: DaysContainerProps) {
  const { currentDate } = props;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Días del mes actual
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Día de la semana del primer día del mes (ajustando para empezar en lunes)
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = (startDay + 6) % 7; // convierte domingo=0 → domingo=6

  // Calculamos celdas necesarias: solo las que se usen realmente
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startDay + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    return new Date(year, month, dayNumber);
  });

  return (
    <div className="grid grid-cols-7 gap-[1px] w-full bg-slate-900 p-[1px] flex-grow">
      {cells.map((day, index) =>
        day ? (
          <div key={index} className="aspect-[1/1]">
            <Day num={day} calendarioAutoescuelaProps={props} />
          </div>
        ) : (
          <div key={index} className="aspect-[1/1] bg-slate-900" />
        )
      )}
    </div>
  );
}

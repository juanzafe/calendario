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

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  let startDay = (firstDay.getDay() + 6) % 7; // Ajusta para empezar en lunes
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startDay + 1;

    // Día del mes actual
    if (dayNumber >= 1 && dayNumber <= daysInMonth) {
      return { date: new Date(year, month, dayNumber), type: "current" };
    }

    // Días del mes anterior
    if (dayNumber < 1) {
      const prevMonthDate = new Date(year, month, dayNumber);
      return { date: prevMonthDate, type: "prev" };
    }

    // Días del mes siguiente
    const nextMonthDate = new Date(year, month, dayNumber);
    return { date: nextMonthDate, type: "next" };
  });

  return (
    <div className="grid grid-cols-7 gap-[1px] w-full bg-gray-200 p-[1px] max-h-[85vh]">
      {cells.map(({ date, type }, index) =>
        type === "current" ? (
          <div
            key={index}
            className="flex items-center justify-center h-[36px] sm:h-[44px] md:h-[48px] lg:h-[52px]"
          >
            <Day num={date} calendarioAutoescuelaProps={props} />
          </div>
        ) : (
          <div
            key={index}
            className="flex items-center justify-center h-[36px] sm:h-[44px] md:h-[48px] lg:h-[52px] bg-gray-50 border border-gray-200 text-gray-400 text-xs sm:text-sm select-none"
          >
            {date.getDate()}
          </div>
        )
      )}
    </div>
  );
}

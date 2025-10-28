import { Day } from "./Day";
import { CalendarioAutoescuelaProps } from "./Month";
import { useIsMobile } from "../hooks/useIsMobile";

interface DaysContainerProps {
  currentDate: Date;
  calendario: CalendarioAutoescuelaProps["calendario"];
  addClass: CalendarioAutoescuelaProps["addClass"];
  removeClass: CalendarioAutoescuelaProps["removeClass"];
  resetClass: CalendarioAutoescuelaProps["resetClass"];
  jornada: CalendarioAutoescuelaProps["jornada"];
  setJornada: CalendarioAutoescuelaProps["setJornada"];
  vacationNumber: CalendarioAutoescuelaProps["vacationNumber"];
  onVacationChange: CalendarioAutoescuelaProps["onVacationChange"];
}

export function DaysContainer(props: DaysContainerProps) {
  const { currentDate } = props;
  const isMobile = useIsMobile();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  let startDay = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startDay + 1;
    if (dayNumber >= 1 && dayNumber <= daysInMonth) {
      return { date: new Date(year, month, dayNumber), type: "current" };
    }
    if (dayNumber < 1) {
      const prevMonthDate = new Date(year, month, dayNumber);
      return { date: prevMonthDate, type: "prev" };
    }
    const nextMonthDate = new Date(year, month, dayNumber);
    return { date: nextMonthDate, type: "next" };
  });

  return (
    <div className="grid grid-cols-7 gap-[1px] w-full bg-gray-200 p-[1px]">
      {cells.map(({ date, type }, index) =>
        type === "current" ? (
          <div
            key={index}
            className={`flex flex-col items-center justify-center text-center 
            bg-white 
            ${isMobile ? "h-[72px]" : "h-[64px]"}
            transition-all duration-200`}
          >
            <Day num={date} calendarioAutoescuelaProps={props} />
          </div>
        ) : (
          <div
            key={index}
            className={`flex flex-col items-center justify-center text-center 
            ${isMobile ? "h-[72px]" : "h-[64px]"} 
            bg-gray-50 border border-gray-200 text-gray-400 text-xs sm:text-sm select-none`}
          >
            {date.getDate()}
          </div>
        )
      )}
    </div>
  );
}

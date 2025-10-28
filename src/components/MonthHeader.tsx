import { DayHeader } from "./DayHeader";
import { CalendarioAutoescuelaProps } from "./Month";

export function MonthHeader(props: CalendarioAutoescuelaProps) {
  return (
    <div className="w-full grid grid-cols-7 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold uppercase border-b border-gray-300">
      {["L", "M", "X", "J", "V", "S", "D"].map((dia) => (
        <DayHeader key={dia} label={dia} />
      ))}
    </div>
  );
}

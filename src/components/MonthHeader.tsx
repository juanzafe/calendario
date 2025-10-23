import { DayHeader } from "./DayHeader";
import { CalendarioAutoescuelaProps } from "./Month";

export function MonthHeader(props: CalendarioAutoescuelaProps) {
  return (
    <div className="w-full grid grid-cols-7 bg-green-700 text-white text-lg font-semibold shadow-md rounded-t-xl">
      {["L", "M", "X", "J", "V", "S", "D"].map((dia) => (
        <DayHeader
          key={dia}
          label={dia}
        />
      ))}
    </div>
  );
}

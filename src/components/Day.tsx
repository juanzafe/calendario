import { CalendarioAutoescuelaProps } from "./Month";

type DayProps = {
  num: Date;
  calendarioAutoescuelaProps: CalendarioAutoescuelaProps;
};

export function Day({ num, calendarioAutoescuelaProps }: DayProps) {
  const clasesDelDia =
    calendarioAutoescuelaProps.calendario.calculateClassesForDate(num);

  const getClassByCantidad = (cantidad: number): string => {
    if (cantidad < 8)
      return "bg-blue-100 border border-blue-300 text-blue-800"; // pocas clases
    return "bg-red-100 border border-red-300 text-red-800"; // muchas clases
  };

  return (
    <div
      key={num.toDateString()}
      className={`flex flex-col items-center justify-between rounded-md shadow-sm hover:shadow-md transition-all duration-200 ${getClassByCantidad(
        clasesDelDia
      )} w-full h-full p-[2px] sm:p-[4px] text-[10px] sm:text-xs`}
    >
      {/* Día del mes */}
      <div className="font-semibold text-xs sm:text-sm">{num.getDate()}</div>

      {/* Número de clases */}
      <div className="font-medium text-[9px] sm:text-xs mb-[2px]">
        {clasesDelDia} clase{clasesDelDia !== 1 ? "s" : ""}
      </div>

      {/* Botones */}
      <div className="flex gap-[2px] sm:gap-1">
        <button
          onClick={() => calendarioAutoescuelaProps.addClass(num)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[9px]"
        >
          ⬆️
        </button>
        <button
          onClick={() => calendarioAutoescuelaProps.removeClass(num)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[9px]"
        >
          ⬇️
        </button>
      </div>

      {/* Botón Reset */}
      <button
        onClick={() => calendarioAutoescuelaProps.resetClass(num)}
        className="text-[8px] sm:text-[10px] text-gray-600 hover:text-gray-900 underline mt-[2px]"
      >
        Reset
      </button>
    </div>
  );
}

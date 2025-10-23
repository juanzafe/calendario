import { CalendarioAutoescuelaProps } from "./Month";
import { Plus, Minus, RotateCcw } from "lucide-react"; // 👈 nuevos iconos modernos

type DayProps = {
  num: Date;
  calendarioAutoescuelaProps: CalendarioAutoescuelaProps;
};

export function Day({ num, calendarioAutoescuelaProps }: DayProps) {
  const clasesDelDia =
    calendarioAutoescuelaProps.calendario.calculateClassesForDate(num);

  const getClassByCantidad = (cantidad: number): string => {
    if (cantidad < 8)
      return "bg-blue-100 border border-blue-300 text-blue-800";
    return "bg-red-100 border border-red-300 text-red-800";
  };

  return (
    <div
      key={num.toDateString()}
      className={`flex items-center justify-between rounded-sm shadow-sm transition-all duration-200 ${getClassByCantidad(
        clasesDelDia
      )} w-full h-full px-[4px] sm:px-[6px]`}
    >
      {/* IZQUIERDA: día y clases */}
      <div className="flex flex-col items-start leading-tight">
        <div className="font-bold text-[12px] sm:text-[14px]">{num.getDate()}</div>
        <div className="text-[11px] sm:text-[12px] font-medium">
          {clasesDelDia} clase{clasesDelDia !== 1 ? "s" : ""}
        </div>
      </div>

      {/* DERECHA: botones con íconos Lucide */}
      <div className="flex items-center justify-end gap-[4px] sm:gap-[6px]">
        <button
          onClick={() => calendarioAutoescuelaProps.addClass(num)}
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Añadir clase"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => calendarioAutoescuelaProps.removeClass(num)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
          title="Quitar clase"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => calendarioAutoescuelaProps.resetClass(num)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title="Resetear clases"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

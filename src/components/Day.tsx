import { CalendarioAutoescuelaProps } from "./Month";
import { Plus, Minus, RotateCcw, Check } from "lucide-react";

type DayProps = {
  num: Date;
  calendarioAutoescuelaProps: CalendarioAutoescuelaProps;
};

export function Day({ num, calendarioAutoescuelaProps }: DayProps) {
  const { calendario, jornada, addClass, removeClass, resetClass } =
    calendarioAutoescuelaProps;

  const clasesDelDia = calendario.calculateClassesForDate(num);

  // ✅ Muestra el check según el tipo de jornada
  const shouldShowCheck =
    (jornada === "completa" && clasesDelDia >= 13) ||
    (jornada === "media" && clasesDelDia >= 8);

  // ✅ Colores tenues según si cumple o no
  const getClassByCantidad = (): string => {
    if (shouldShowCheck)
      return "bg-green-100 border border-green-300 text-green-800";
    return "bg-blue-100 border border-blue-300 text-blue-800";
  };

  return (
    <div
      key={num.toDateString()}
      className={`flex items-center justify-between rounded-sm shadow-sm transition-all duration-200 ${getClassByCantidad()} w-full h-full px-[4px] sm:px-[6px]`}
    >
      {/* IZQUIERDA: día y clases */}
      <div className="flex flex-col items-start leading-tight">
        <div className="font-bold text-[12px] sm:text-[14px]">
          {num.getDate()}
        </div>

        <div className="text-[11px] sm:text-[12px] font-medium flex items-center gap-1">
          {clasesDelDia} clase{clasesDelDia !== 1 ? "s" : ""}
          {shouldShowCheck && (
            <Check
              size={13}
              className="text-green-600 ml-[2px]"
              strokeWidth={3}
            />
          )}
        </div>
      </div>

      {/* DERECHA: botones con íconos */}
      <div className="flex items-center justify-end gap-[4px] sm:gap-[6px]">
        <button
          onClick={() => addClass(num)}
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Añadir clase"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => removeClass(num)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
          title="Quitar clase"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => resetClass(num)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title="Resetear clases"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

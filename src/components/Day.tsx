import { useState } from "react";
import { CalendarioAutoescuelaProps } from "./Month";
import { Check, ChevronDown } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile"; // 👈 usamos tu hook existente

type DayProps = {
  num: Date;
  calendarioAutoescuelaProps: CalendarioAutoescuelaProps & {
    setClassCount?: (day: Date, count: number) => void;
  };
};

export function Day({ num, calendarioAutoescuelaProps }: DayProps) {
  const { calendario, jornada, setClassCount } = calendarioAutoescuelaProps;
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile(); // 👈 detecta si es móvil

  const clasesDelDia = calendario.calculateClassesForDate(num);

  const shouldShowCheck =
    (jornada === "completa" && clasesDelDia >= 13) ||
    (jornada === "media" && clasesDelDia >= 8);

  const getClassByCantidad = (): string => {
    if (shouldShowCheck)
      return "bg-green-100 border border-green-300 text-green-800";
    return "bg-blue-100 border border-blue-300 text-blue-800";
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setClassCount?.(num, value);
    setIsEditing(false);
  };

  return (
    <div
      key={num.toDateString()}
      onClick={() => setIsEditing(true)}
      className={`flex flex-col items-center justify-center rounded-md shadow-sm transition-all duration-200 cursor-pointer ${getClassByCantidad()} w-full h-full px-[4px] sm:px-[6px]`}
    >
      {/* Día + check */}
      <div className="flex items-center justify-center gap-[3px] font-bold text-[12px] sm:text-[14px]">
        <span>{num.getDate()}</span>
        {shouldShowCheck && (
          <Check size={13} className="text-green-600" strokeWidth={3} />
        )}
      </div>

      {/* Clases del día */}
      {isEditing ? (
        <select
          autoFocus
          defaultValue={clasesDelDia}
          onChange={handleSelectChange}
          onBlur={() => setIsEditing(false)}
          className="mt-1 text-[11px] sm:text-[12px] border border-gray-300 rounded px-1 py-[2px] focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {Array.from({ length: 19 }, (_, i) => (
            <option key={i} value={i}>
              {i} clase{i !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      ) : (
        <div className="text-[11px] sm:text-[12px] font-medium flex items-center gap-1 mt-1">
          {/* 👇 Texto compacto en móvil */}
          {isMobile
            ? `${clasesDelDia} cls`
            : `${clasesDelDia} clase${clasesDelDia !== 1 ? "s" : ""}`}
          <ChevronDown size={12} className="opacity-70 ml-[2px]" />
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { CalendarioAutoescuelaProps } from "./Month";
import { Check, ChevronDown } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

type DayProps = {
  num: Date;
  calendarioAutoescuelaProps: CalendarioAutoescuelaProps & {
    setClassCount?: (day: Date, count: number) => void;
  };
};

export function Day({ num, calendarioAutoescuelaProps }: DayProps) {
  const { calendario, jornada, setClassCount } = calendarioAutoescuelaProps;
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const clasesDelDia = calendario.calculateClassesForDate(num);

  const shouldShowCheck =
    (jornada === "completa" && clasesDelDia >= 13) ||
    (jornada === "media" && clasesDelDia >= 8);

  const getClassByCantidad = (): string => {
    if (shouldShowCheck)
      return "bg-green-100 border border-green-300 text-green-800";
    return "bg-blue-100 border border-blue-300 text-blue-800";
  };

  const handleSelectChange = (value: number) => {
    setClassCount?.(num, value);
    setIsEditing(false);
  };

  // 👇 Cerrar al hacer clic fuera (desktop + móvil)
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div
      ref={containerRef}
      key={num.toDateString()}
      onClick={() => setIsEditing(true)}
      className={`relative flex flex-col items-center justify-center rounded-md shadow-sm transition-all duration-200 cursor-pointer ${getClassByCantidad()} w-full h-full px-[4px] sm:px-[6px]`}
    >
      {/* Día + check */}
      <div className="flex items-center justify-center gap-[3px] font-bold text-[12px] sm:text-[14px]">
        <span>{num.getDate()}</span>
        {shouldShowCheck && (
          <Check size={13} className="text-green-600" strokeWidth={3} />
        )}
      </div>

      {/* Clases del día */}
      {!isEditing ? (
        <div className="text-[11px] sm:text-[12px] font-medium flex items-center gap-1 mt-1">
          {isMobile
            ? `${clasesDelDia} cls`
            : `${clasesDelDia} clase${clasesDelDia !== 1 ? "s" : ""}`}
          <ChevronDown size={12} className="opacity-70 ml-[2px]" />
        </div>
      ) : (
        <div
          className={`absolute z-50 mt-10 bg-white border border-gray-300 rounded-md shadow-lg p-1 w-[90%] max-h-40 overflow-y-auto 
            transform transition-all duration-200 ease-out origin-top
            ${isEditing ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          {Array.from({ length: 19 }, (_, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectChange(i);
              }}
              className={`px-2 py-1 text-[12px] rounded cursor-pointer hover:bg-emerald-100 ${
                i === clasesDelDia ? "bg-emerald-200 font-semibold" : ""
              }`}
            >
              {i} clase{i !== 1 ? "s" : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Plane } from "lucide-react";


interface VacacionesYJornadaProps {
  workingDays: number;
  jornada: "media" | "completa";
  setJornada: (value: "media" | "completa") => void;
  onVacationChange: (days: number) => void;
  vacationNumber: number;
}

const VacacionesYJornada: React.FC<VacacionesYJornadaProps> = ({
  workingDays,
  jornada,
  setJornada,
  onVacationChange,
  vacationNumber
}) => {


  const handleVacationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    onVacationChange(value);
  };

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm flex flex-col text-sm">
      <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
        <Plane size={16} />
        <span>Vacaciones</span>
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-3 flex flex-col gap-3">
        {/* Selector de vacaciones */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            Días: <strong>{vacationNumber}</strong>
          </span>
          <select
            id="vacation-select"
            value={vacationNumber}
            onChange={handleVacationChange}
            className="border border-emerald-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {[...Array(workingDays + 1)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle de jornada */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-700 font-medium">Jornada:</span>
          <button
            onClick={() =>
              setJornada(jornada === "media" ? "completa" : "media")
            }
            className={`relative w-20 h-8 rounded-full transition-colors duration-300 ${
              jornada === "completa" ? "bg-emerald-500" : "bg-emerald-200"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                jornada === "completa" ? "translate-x-12" : ""
              }`}
            ></span>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-emerald-900">
              {jornada === "completa" ? "Completa" : "Media"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacacionesYJornada;

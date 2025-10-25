import React from "react";
import { X, Sun } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  jornada: "media" | "completa";
  onJornadaChange: (jornada: "media" | "completa") => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  jornada,
  onJornadaChange,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-emerald-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
            <Sun size={18} /> Ajustes de Jornada
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-700 font-medium">
            Selecciona tu jornada laboral:
          </label>

          <select
            value={jornada}
            onChange={(e) =>
              onJornadaChange(e.target.value as "media" | "completa")
            }
            className="w-full border border-emerald-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="media">Media jornada (7.8 clases/día)</option>
            <option value="completa">Jornada completa (12.5 clases/día)</option>
          </select>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};


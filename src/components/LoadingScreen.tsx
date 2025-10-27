import { CircularProgress } from "@mui/material";
import React from "react";

interface LoadingScreenProps {
  /** Texto mostrado debajo del spinner */
  message?: string;
  /** Logo opcional (ruta o import) */
  logo?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Cargando...",
  logo,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      {logo && (
        <img
          src={logo}
          alt="Logo"
          className="w-16 h-16 mb-4 animate-pulse opacity-90"
        />
      )}

      <CircularProgress size={48} thickness={4} color="success" />

      <p className="mt-4 text-base font-medium text-gray-600 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;

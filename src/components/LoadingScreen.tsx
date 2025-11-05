import { CircularProgress } from "@mui/material";
import type React from "react";
import calendar from "../assets/calendar.png";

interface LoadingScreenProps {
	
	message?: string;
	
	logo?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
	message = "Cargando...",
	logo = calendar, 
}) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
			{logo && (
				<img
					src={logo}
					alt="Logo"
					className="mb-6 animate-pulse opacity-90"
					style={{ maxWidth: "300px", height: "auto" }}
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

import { useEffect } from "react";
import type { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface ContadorProps {
	calendario: CalendarioAutoescuela;
	currentDate: Date;
	onChange?: (clases: number) => void;
}

export function Contador({ calendario, currentDate, onChange }: ContadorProps) {
	const mesVisible = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1,
	);
	const clasesDelMesVisible =
		calendario.totalNumberOfClassesInMonth(mesVisible);

	useEffect(() => {
		onChange?.(clasesDelMesVisible);
	}, [clasesDelMesVisible, onChange]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex items-center justify-center gap-2 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow"
		>
			<GraduationCap size={20} className="text-emerald-600" />
			<span className="text-sm sm:text-base">
				<strong>{clasesDelMesVisible}</strong> clases este mes
			</span>
		</motion.div>
	);
}

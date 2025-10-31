import type React from "react";
import { useState, useEffect } from "react";
import {
	CalendarDays,
	Sun,
	Target,
	ClipboardList,
	GraduationCap,
	Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import VacacionesYJornada from "./VacacionesYJornada";

export const spanishHolidays2025: string[] = [
	"2025-01-01",
	"2025-01-06",
	"2025-02-28",
	"2025-04-17",
	"2025-04-18",
	"2025-05-01",
	"2025-08-15",
	"2025-10-13",
	"2025-11-01",
	"2025-12-06",
	"2025-12-08",
	"2025-12-25",
	"2025-08-19",
	"2025-09-08",
	"2025-12-24",
	"2025-12-31",
];

export function getWorkingDaysWithHolidays(
	year: number,
	month: number,
	holidays: string[] = [],
): string[] {
	const workingDays: string[] = [];
	const lastDay = new Date(year, month + 1, 0).getDate();

	for (let day = 1; day <= lastDay; day++) {
		const date = new Date(year, month, day);
		const dayOfWeek = date.getDay();

		// Formateo local correcto (sin UTC)
		const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(
			day,
		).padStart(2, "0")}`;

		// Excluir fines de semana y festivos
		if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formatted)) {
			workingDays.push(formatted);
		}
	}

	return workingDays;
}

interface WorkingDaysCounterProps {
	year: number;
	month: number;
	holidays?: string[];
	clasesDelMesVisible: number;
	jornada: "media" | "completa";
	setJornada: (value: "media" | "completa") => void;
	vacationNumber: number;
	onVacationChange: (days: number) => void;
}

const WorkingDaysCounter: React.FC<WorkingDaysCounterProps> = ({
	year,
	month,
	holidays = spanishHolidays2025,
	clasesDelMesVisible,
	jornada,
	setJornada,
	vacationNumber,
	onVacationChange,
}) => {
	const [workingDays, setWorkingDays] = useState(0);
	const [remainingDays, setRemainingDays] = useState(0);

	useEffect(() => {
		const allWorkingDays = getWorkingDaysWithHolidays(year, month, holidays);
		setWorkingDays(allWorkingDays.length);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const remaining = allWorkingDays.filter((dayStr) => {
			const dayDate = new Date(dayStr);
			dayDate.setHours(0, 0, 0, 0);
			return dayDate > today;
		});

		setRemainingDays(remaining.length);
	}, [year, month, holidays, jornada]);

	const valorPorDia = jornada === "media" ? 7.8125 : 12.5;

	const adjustedDays = Math.max(workingDays - vacationNumber, 0);
	const adjustedRemaining = Math.max(remainingDays - vacationNumber, 0);
	const adjustedClassesNeeded =
		Math.round(adjustedDays * valorPorDia) - clasesDelMesVisible;
	const adjustedClassesPerDay =
		adjustedRemaining > 0
			? (adjustedClassesNeeded / adjustedRemaining).toFixed(2)
			: "0";

	const cardBase =
		"bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm flex flex-col text-sm";
	console.log("==== pintando vacactionNum", vacationNumber);
	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col sm:flex-row gap-4 w-full justify-between"
		>
			{/* 📋 RESUMEN DEL MES */}
			<div className="flex-1">
				<div className={cardBase}>
					<div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
						<ClipboardList size={16} />
						<span>Resumen del mes</span>
					</div>
					<div className="bg-white rounded-md border border-gray-200 p-3 text-sm space-y-1.5">
						<div className="flex justify-between">
							<span className="flex items-center gap-1 text-gray-700">
								<GraduationCap size={15} className="text-emerald-600" /> Clases
								dadas:
							</span>
							<strong>{clasesDelMesVisible}</strong>
						</div>

						<div className="flex justify-between">
							<span className="flex items-center gap-1 text-gray-700">
								<CalendarDays size={15} className="text-emerald-600" /> Días
								laborables:
							</span>
							<strong>{adjustedDays}</strong>
						</div>

						<div className="flex justify-between">
							<span className="flex items-center gap-1 text-gray-700">
								<Sun size={15} className="text-emerald-600" /> Días restantes:
							</span>
							<strong>{adjustedRemaining}</strong>
						</div>
					</div>
				</div>
			</div>

			{/* 🎯 OBJETIVOS */}
			<div className="flex-1">
				<div className={cardBase}>
					<div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
						<Target size={16} />
						<span>Objetivos</span>
					</div>
					<div className="bg-white rounded-md border border-gray-200 p-3 text-sm space-y-1.5">
						<div className="flex justify-between">
							<span className="flex items-center gap-1 text-gray-700">
								<Target size={15} className="text-emerald-600" /> Clases
								objetivo:
							</span>
							<strong>{Math.round(adjustedDays * valorPorDia)}</strong>
						</div>

						<div className="flex justify-between">
							<span className="flex items-center gap-1 text-gray-700">
								<CalendarDays size={15} className="text-emerald-600" /> Faltan:
							</span>
							<strong>{adjustedClassesNeeded}</strong>
						</div>

						<div className="flex justify-between">
							<span className="flex items-center gap-1 text-gray-700">
								<Clock size={15} className="text-emerald-600" /> Clases por día
								necesarias:
							</span>
							<strong>{adjustedClassesPerDay}</strong>
						</div>
					</div>
				</div>
			</div>

			{/* ✈️ VACACIONES + JORNADA */}
			<div className="flex-1">
				<VacacionesYJornada
					workingDays={workingDays}
					jornada={jornada}
					setJornada={setJornada}
					onVacationChange={onVacationChange}
					vacationNumber={vacationNumber}
				/>
			</div>
		</motion.div>
	);
};

export default WorkingDaysCounter;

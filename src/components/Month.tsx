import React, { useState, useEffect } from "react";
import type { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import WorkingDaysCounter from "./WorkingDaysCounter";
import { useIsMobile } from "../hooks/useIsMobile";

export interface CalendarioAutoescuelaProps {
	calendario: CalendarioAutoescuela;
	addClass: (day: Date) => void;
	removeClass: (day: Date) => void;
	resetClass: (day: Date) => void;
	onMonthChange?: (date: Date) => void;
	jornada: "media" | "completa";
	setJornada: (value: "media" | "completa") => void;
	vacationNumber: number;
	onVacationChange: (days: number) => void;
	setClassCount?: (day: Date, count: number) => void;
}

export function Month(props: CalendarioAutoescuelaProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [clasesDelMes, setClasesDelMes] = useState(0);
	const isMobile = useIsMobile();

	const {
		calendario,
		onMonthChange,
		jornada,
		setJornada,
		vacationNumber,
		onVacationChange,
	} = props;

	useEffect(() => {
		onMonthChange?.(currentDate);
		const clasesMes = calendario.totalNumberOfClassesInMonth(currentDate);
		setClasesDelMes(clasesMes);
	}, [currentDate, calendario]);

	const handlePreviousMonth = () => {
		const prevMonth = new Date(currentDate);
		prevMonth.setMonth(prevMonth.getMonth() - 1);
		setCurrentDate(prevMonth);
	};

	const handleNextMonth = () => {
		const nextMonth = new Date(currentDate);
		nextMonth.setMonth(nextMonth.getMonth() + 1);
		setCurrentDate(nextMonth);
	};

	const nombreMes = currentDate.toLocaleString("es-ES", {
		month: "long",
		year: "numeric",
	});

	return (
		<div
			className={`
        flex flex-col shadow-sm border border-emerald-100 overflow-hidden
        bg-gradient-to-b from-emerald-50 to-white text-gray-900
        w-full h-full
        ${isMobile ? "rounded-none" : "rounded-xl"}
      `}
		>
			{/* 🔹 Encabezado del mes */}
			<div
				className={`
          flex justify-between items-center bg-emerald-100 text-emerald-800 border-b border-emerald-200
          ${isMobile ? "px-3 py-2" : "px-6 py-3"}
        `}
			>
				<button
					onClick={handlePreviousMonth}
					className="p-1.5 hover:bg-emerald-200 rounded-full transition"
					title="Mes anterior"
				>
					<ChevronLeft size={isMobile ? 20 : 22} />
				</button>

				<div className="flex items-center gap-2 select-none">
					<Calendar size={isMobile ? 18 : 20} className="text-emerald-700" />
					<h1 className="capitalize tracking-wide text-base sm:text-lg font-semibold">
						{nombreMes}
					</h1>
				</div>

				<button
					onClick={handleNextMonth}
					className="p-1.5 hover:bg-emerald-200 rounded-full transition"
					title="Mes siguiente"
				>
					<ChevronRight size={isMobile ? 20 : 22} />
				</button>
			</div>

			{/* 🔹 Cabecera de los días */}
			<MonthHeader {...props} />

			{/* 🔹 Contenedor de días */}
			<DaysContainer {...props} currentDate={currentDate} jornada={jornada} />

			{/* 🔹 Contador y control */}
			<div
				className={`
          bg-white border-t border-gray-200
          ${isMobile ? "py-3 px-3" : "py-4 px-6"}
        `}
			>
				<WorkingDaysCounter
					year={currentDate.getFullYear()}
					month={currentDate.getMonth()}
					clasesDelMesVisible={clasesDelMes}
					jornada={jornada}
					setJornada={setJornada}
					vacationNumber={vacationNumber}
					onVacationChange={onVacationChange}
				/>
			</div>
		</div>
	);
}

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import type { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";
import WorkingDaysCounter from "./WorkingDaysCounter";

export interface CalendarioAutoescuelaProps {
	calendario: CalendarioAutoescuela;
	onMonthChange?: (date: Date) => void;
	jornada: "media" | "completa";
	setJornada: (value: "media" | "completa") => void;
	vacationNumber: number;
	setVacationNumber: (value: number) => void;
	naturalVacationDays: number;
	vacationDates: string[];
	setVacationDates: (dates: string[]) => void;
	setClassCount?: (day: Date, count: number) => void;
	onSaveVacations: (vacationData: {
		vacationNumber: number;
		naturalDays: number;
		startDate: string;
		endDate: string;
		vacationDates: string[];
	}) => Promise<void>;
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
		setVacationNumber,
		naturalVacationDays,
		vacationDates,
		setVacationDates,
		onSaveVacations,
	} = props;

	useEffect(() => {
		onMonthChange?.(currentDate);
		const clasesMes = calendario.totalNumberOfClassesInMonth(currentDate);
		setClasesDelMes(clasesMes);
	}, [currentDate, calendario, onMonthChange]);

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

	const nombreMes = currentDate.toLocaleString("es-ES", { month: "long" });
	const year = currentDate.getFullYear();

	return (
		<div
			className={`
        flex flex-col shadow-sm border border-emerald-100 overflow-hidden
        bg-gradient-to-b from-emerald-50 to-white text-gray-900
        w-full h-full
        ${isMobile ? "rounded-none" : "rounded-xl"}
      `}
		>
			<div
				className={`
          flex justify-between items-center bg-emerald-100 text-emerald-800 border-b border-emerald-200
          ${isMobile ? "px-3 py-2" : "px-6 py-3"}
        `}
			>
				<button
					type="button"
					onClick={handlePreviousMonth}
					className="p-1.5 hover:bg-emerald-200 rounded-full transition"
					title="Mes anterior"
				>
					<ChevronLeft size={isMobile ? 20 : 22} />
				</button>

				<div className="flex items-center gap-2 select-none">
					<Calendar size={isMobile ? 18 : 20} className="text-emerald-700" />
					<h1 className="capitalize tracking-wide text-base sm:text-lg font-semibold">
						{`${nombreMes} ${year}`}
					</h1>
				</div>

				<button
					type="button"
					onClick={handleNextMonth}
					className="p-1.5 hover:bg-emerald-200 rounded-full transition"
					title="Mes siguiente"
				>
					<ChevronRight size={isMobile ? 20 : 22} />
				</button>
			</div>
			<MonthHeader {...props} />
			<DaysContainer {...props} currentDate={currentDate} />
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
					setVacationNumber={setVacationNumber}
					naturalVacationDays={naturalVacationDays}
					currentMonth={currentDate.getMonth()}
					currentYear={currentDate.getFullYear()}
					vacationDates={vacationDates}
					setVacationDates={setVacationDates}
					onSaveVacations={onSaveVacations}
				/>
			</div>
		</div>
	);
}

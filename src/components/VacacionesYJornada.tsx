import { AlertCircle, Briefcase, Calendar, Plane, X } from "lucide-react";
import type React from "react";
import { useState } from "react";

const spanishHolidays2025 = [
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

const spanishHolidays2026 = [
	"2026-01-01",
	"2026-01-06",
	"2026-02-28",
	"2026-04-02",
	"2026-04-03",
	"2026-05-01",
	"2026-08-15",
	"2026-08-19",
	"2026-09-08",
	"2026-10-12",
	"2026-11-02",
	"2026-12-07",
	"2026-12-08",
	"2026-12-25",
];

interface VacacionesYJornadaProps {
	workingDays: number;
	jornada: "media" | "completa";
	setJornada: (value: "media" | "completa") => void;
	vacationNumber: number;
	setVacationNumber: (value: number) => void;
	currentMonth: number;
	currentYear: number;
	vacationDates: string[];
	setVacationDates: (dates: string[]) => void;
	onSaveVacations: (vacationData: {
		vacationNumber: number;
		naturalDays: number;
		startDate: string;
		endDate: string;
		vacationDates: string[];
	}) => Promise<void>;
	naturalVacationDays: number;
}

const VacacionesYJornada: React.FC<VacacionesYJornadaProps> = ({
	jornada,
	setJornada,
	setVacationNumber,
	currentYear,
	setVacationDates,
	onSaveVacations,
	naturalVacationDays,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [naturalDays, setNaturalDays] = useState(0);
	const [calculatedEndDate, setCalculatedEndDate] = useState("");
	const [calculatedWorkingDays, setCalculatedWorkingDays] = useState(0);

	const holidays =
		currentYear === 2026 ? spanishHolidays2026 : spanishHolidays2025;

	const isWorkingDay = (date: Date) => {
		const dayOfWeek = date.getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) return false;
		const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		return !holidays.includes(formatted);
	};

	const calculateEndDateAndWorkingDays = (start: string, daysCount: number) => {
		if (!start || daysCount <= 0) {
			setCalculatedEndDate("");
			setCalculatedWorkingDays(0);
			return;
		}

		const startDateObj = new Date(start);
		let workingDaysCount = 0;
		const currentDate = new Date(startDateObj);

		// Contar días laborables en el rango de días naturales
		for (let i = 0; i < daysCount; i++) {
			if (isWorkingDay(currentDate)) {
				workingDaysCount++;
			}
			if (i < daysCount - 1) {
				currentDate.setDate(currentDate.getDate() + 1);
			}
		}

		const endFormatted = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

		setCalculatedEndDate(endFormatted);
		setCalculatedWorkingDays(workingDaysCount);
	};

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newStartDate = e.target.value;
		setStartDate(newStartDate);
		calculateEndDateAndWorkingDays(newStartDate, naturalDays);
	};

	const handleNaturalDaysChange = (days: number) => {
		setNaturalDays(days);
		calculateEndDateAndWorkingDays(startDate, days);
	};

	const handleSaveVacations = async () => {
		if (!startDate || naturalDays <= 0) return;

		const startDateObj = new Date(startDate);
		const endDateObj = new Date(calculatedEndDate);
		const dates: string[] = [];
		const tempDate = new Date(startDateObj);

		while (tempDate <= endDateObj) {
			const formatted = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
			dates.push(formatted);
			tempDate.setDate(tempDate.getDate() + 1);
		}

		setVacationDates(dates);
		setVacationNumber(calculatedWorkingDays);

		await onSaveVacations({
			vacationNumber: calculatedWorkingDays,
			naturalDays: naturalDays,
			startDate,
			endDate: calculatedEndDate,
			vacationDates: dates,
		});

		setShowModal(false);
	};

	const handleClearVacations = async () => {
		setVacationNumber(0);
		setVacationDates([]);
		setStartDate("");
		setNaturalDays(0);
		setCalculatedEndDate("");
		setCalculatedWorkingDays(0);

		await onSaveVacations({
			vacationNumber: 0,
			naturalDays: 0,
			startDate: "",
			endDate: "",
			vacationDates: [],
		});

		setShowModal(false);
	};

	const cardBase =
		"bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm flex flex-col text-sm";

	return (
		<>
			<div className={cardBase}>
				<div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
					<Briefcase size={16} />
					<span>Configuración</span>
				</div>
				<div className="bg-white rounded-md border border-gray-200 p-3 text-sm space-y-2">
					<div className="flex justify-between items-center">
						<span className="flex items-center gap-1 text-gray-700">
							<Briefcase size={15} className="text-emerald-600" /> Tipo de
							jornada:
						</span>
						<select
							value={jornada}
							onChange={(e) =>
								setJornada(e.target.value as "media" | "completa")
							}
							className="px-2 py-1 border border-gray-300 rounded-md text-sm font-medium"
						>
							<option value="completa">Completa</option>
							<option value="media">Media</option>
						</select>
					</div>

					<div className="flex justify-between items-center pt-2 border-t border-gray-200">
						<span className="flex items-center gap-1 text-gray-700">
							<Plane size={15} className="text-emerald-600" /> Vacaciones:
						</span>
						<button
							type="button"
							onClick={() => setShowModal(true)}
							className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition"
						>
							{naturalVacationDays > 0
								? `${naturalVacationDays} días`
								: "Configurar"}
						</button>
					</div>
				</div>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
								<Calendar size={20} className="text-emerald-600" />
								Configurar Vacaciones
							</h2>
							<button
								type="button"
								onClick={() => setShowModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X size={20} />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="start-date"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Fecha de inicio
								</label>
								<input
									id="start-date"
									type="date"
									value={startDate}
									onChange={handleStartDateChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
								/>
							</div>

							<div>
								<label
									htmlFor="natural-days"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Días naturales de vacaciones
								</label>
								<select
									id="natural-days"
									value={naturalDays}
									onChange={(e) =>
										handleNaturalDaysChange(Number(e.target.value))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
								>
									<option value={0}>Selecciona días</option>
									{Array.from({ length: 31 }, (_, i) => {
										const value = i + 1; // número de días (1 a 31)
										return (
											<option key={value} value={value}>
												{value} día{value !== 1 ? "s" : ""}
											</option>
										);
									})}
								</select>

								<p className="text-xs text-gray-500 mt-1">
									Días totales incluyendo fines de semana y festivos
								</p>
							</div>

							{calculatedEndDate && (
								<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
									<div className="flex items-start gap-2">
										<AlertCircle size={18} className="text-blue-600 mt-0.5" />
										<div className="text-sm">
											<p className="font-medium text-blue-900">
												Resumen de vacaciones:
											</p>
											<ul className="mt-2 space-y-1 text-blue-800">
												<li>
													• Fecha fin:{" "}
													{new Date(calculatedEndDate).toLocaleDateString(
														"es-ES",
													)}
												</li>
												<li>• Días naturales: {naturalDays}</li>
												<li>• Días laborables: {calculatedWorkingDays}</li>
											</ul>
										</div>
									</div>
								</div>
							)}

							<div className="flex gap-2 pt-2">
								<button
									type="button"
									onClick={handleSaveVacations}
									disabled={!startDate || naturalDays <= 0}
									className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
								>
									Guardar
								</button>
								{naturalVacationDays > 0 && (
									<button
										type="button"
										onClick={handleClearVacations}
										className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
									>
										Borrar
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default VacacionesYJornada;

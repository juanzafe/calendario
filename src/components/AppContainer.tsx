import { Button } from "@mui/material";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import {
	ArrowLeft,
	BarChart3,
	LogOut as LogOutIcon,
	Mail,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useUser } from "reactfire";
import calendar from "../assets/calendar.png";
import { auth, db } from "../firebase/firebase";
import { useIsMobile } from "../hooks/useIsMobile";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import ClasesChart from "./ClasesChart";
import LoadingScreen from "./LoadingScreen";
import { Month } from "./Month";

interface AppContainerProps {
	showOnlyChart?: boolean;
}

export function AppContainer({ showOnlyChart = false }: AppContainerProps) {
	const { data: user } = useUser();
	const isMobile = useIsMobile();
	const [calendario, setCalendario] = useState(new CalendarioAutoescuela());
	const [currentDate, setCurrentDate] = useState(new Date());
	const [jornada, setJornada] = useState<"media" | "completa">("completa");
	const [isLoadingSettings, setIsLoadingSettings] = useState(true);
	const [vacationNumber, setVacationNumber] = useState(0);
	const [naturalVacationDays, setNaturalVacationDays] = useState(0);
	const [vacationDates, setVacationDates] = useState<string[]>([]);

	const navigate = useNavigate();
	const [params] = useSearchParams();

	useEffect(() => {
		const year = parseInt(params.get("year") ?? "", 10);
		const month = parseInt(params.get("month") ?? "", 10);
		if (!Number.isNaN(year) && !Number.isNaN(month)) {
			setCurrentDate(new Date(year, month, 1));
		}
	}, [params]);

	useEffect(() => {
		if (!user?.email || isLoadingSettings) return;
		const saveJornada = async () => {
			const email = user.email ?? "noemail";
			const docRef = doc(db, "userSettings", email);
			await setDoc(docRef, { jornada }, { merge: true });
		};
		saveJornada();
	}, [jornada, user, isLoadingSettings]);

	useEffect(() => {
		if (!user?.email) return;
		const loadUserData = async () => {
			const email = user.email ?? "noemail";

			const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
			const docRef = doc(db, "holidaysPerMonth", email);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				if (data && typeof data === "object") {
					const vacDays = data[`${key}-vacationNumber`] as number | undefined;
					const natDays = data[`${key}-naturalDays`] as number | undefined;
					setVacationNumber(vacDays || 0);
					setNaturalVacationDays(natDays || 0);

					const start = data[`${key}-start`];
					const end = data[`${key}-end`];
					if (start && end) {
						const startDateObj = new Date(start as string);
						const endDateObj = new Date(end as string);
						const dates: string[] = [];
						const tempDate = new Date(startDateObj);
						while (tempDate <= endDateObj) {
							const formatted = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}-${String(tempDate.getDate()).padStart(2, "0")}`;
							dates.push(formatted);
							tempDate.setDate(tempDate.getDate() + 1);
						}
						setVacationDates(dates);
					} else {
						setVacationDates([]);
					}
				}
			}

			const settingsRef = doc(db, "userSettings", email);
			const settingsSnap = await getDoc(settingsRef);
			if (settingsSnap.exists()) {
				const data = settingsSnap.data();
				if (data.jornada === "media" || data.jornada === "completa") {
					setJornada(data.jornada);
				} else {
					await setDoc(settingsRef, { jornada: "completa" }, { merge: true });
					setJornada("completa");
				}
			} else {
				await setDoc(settingsRef, { jornada: "completa" }, { merge: true });
				setJornada("completa");
			}

			setIsLoadingSettings(false);
		};
		loadUserData();
	}, [user, currentDate]);

	useEffect(() => {
		if (!user) return;
		const classesCollectionRef = collection(
			db,
			"classespordia",
			user.email ?? "noemail",
			"dates",
		);
		getDocs(classesCollectionRef).then((querySnapshot) => {
			let newCalendar = calendario;
			querySnapshot.docs.forEach((doc) => {
				const data = doc.data();
				newCalendar = newCalendar.setClassCounter(
					new Date(data.date),
					data.count,
				);
			});
			setCalendario(newCalendar);
		});
	}, [user, calendario]);

	const handleSaveVacations = async (vacationData: {
		vacationNumber: number;
		naturalDays: number;
		startDate: string;
		endDate: string;
		vacationDates: string[];
	}) => {
		if (!user?.email) return;

		const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
		const email = user.email ?? "unknown";
		const docRef = doc(db, "holidaysPerMonth", email);

		const updatedVacationNumber: Record<string, number | string> = {};
		updatedVacationNumber[`${key}-vacationNumber`] =
			vacationData.vacationNumber;
		updatedVacationNumber[`${key}-naturalDays`] = vacationData.naturalDays;
		updatedVacationNumber[`${key}-start`] = vacationData.startDate;
		updatedVacationNumber[`${key}-end`] = vacationData.endDate;

		await setDoc(docRef, updatedVacationNumber, { merge: true });

		setVacationNumber(vacationData.vacationNumber);
		setNaturalVacationDays(vacationData.naturalDays);
		setVacationDates(vacationData.vacationDates);
	};

	if (isLoadingSettings) {
		return <LoadingScreen message="Cargando aplicación..." logo={calendar} />;
	}

	if (showOnlyChart) {
		const nombreMes = currentDate.toLocaleString("es-ES", {
			month: "long",
			year: "numeric",
		});

		return (
			<div className="min-h-screen w-screen bg-gradient-to-b from-gray-50 to-emerald-50 text-gray-800 overflow-y-auto px-6 sm:px-12 py-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
					<div className="flex items-center gap-2">
						<BarChart3 size={28} className="text-emerald-700" />
						<h1 className="text-3xl font-semibold">
							Gráfica de clases – {nombreMes}
						</h1>
					</div>
					<div className="flex flex-row flex-wrap items-center justify-end gap-3 mt-2 sm:mt-0">
						<Button
							variant="outlined"
							startIcon={<ArrowLeft size={18} />}
							onClick={() => navigate("/admin")}
							sx={{
								textTransform: "none",
								borderRadius: 4,
								fontWeight: 500,
								height: "40px",
								minWidth: "180px",
							}}
						>
							Volver al calendario
						</Button>
					</div>
				</div>
				<ClasesChart />
			</div>
		);
	}

	const LogOut = () => (
		<Button
			variant="outlined"
			color="error"
			startIcon={<LogOutIcon size={18} />}
			onClick={() => auth.signOut()}
			sx={{
				borderRadius: 4,
				textTransform: "none",
				fontWeight: 500,
				height: "38px",
				padding: "0 12px",
				marginTop: 0,
			}}
		>
			Cerrar sesión
		</Button>
	);

	return (
		<div
			className={`w-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-y-auto ${isMobile ? "px-4 pt-6 pb-10 space-y-4" : "px-12 pt-6 pb-10 space-y-6"}`}
		>
			<header
				className={`flex flex-col items-center relative text-center ${isMobile ? "mb-4 space-y-3" : "mb-8 space-y-6"}`}
			>
				<div
					className={`flex w-full items-center justify-between ${isMobile ? "flex-col gap-3 text-sm" : "flex-row px-8 mt-2 text-base"}`}
				>
					<div className="flex items-center gap-2 text-emerald-700 font-semibold">
						<User size={isMobile ? 18 : 22} />
						<span>{user?.displayName || "Invitado"}</span>
					</div>
					<div className="flex items-center gap-3 text-gray-600">
						<div className="flex items-center gap-1">
							<Mail size={isMobile ? 14 : 16} />
							<span>{user?.email || "Sin correo"}</span>
						</div>
						<LogOut />
					</div>
				</div>
				<img
					src={calendar}
					alt="Logo calendario"
					className={`w-full object-contain mt-0 ${isMobile ? "max-w-[140px]" : "max-w-[230px] -translate-x-14"}`}
				/>
			</header>

			<section
				className={`bg-white rounded-xl shadow-md border border-gray-200 w-full ${isMobile ? "p-0" : "p-6"}`}
			>
				<Month
					calendario={calendario}
					setClassCount={async (day, count) => {
						const updated = calendario.setClassCounter(day, count);
						setCalendario(updated);
						if (!user?.email) return;
						const email = user.email;
						const docRef = doc(
							db,
							"classespordia",
							email,
							"dates",
							day.toISOString().split("T")[0],
						);
						await setDoc(
							docRef,
							{ date: day.toISOString(), count },
							{ merge: true },
						);
					}}
					onMonthChange={(date) => setCurrentDate(date)}
					jornada={jornada}
					setJornada={setJornada}
					vacationNumber={vacationNumber}
					setVacationNumber={setVacationNumber}
					naturalVacationDays={naturalVacationDays}
					vacationDates={vacationDates}
					setVacationDates={setVacationDates}
					onSaveVacations={handleSaveVacations}
				/>
			</section>

			<div className="flex justify-center mt-8">
				<Button
					variant="contained"
					color="primary"
					startIcon={<BarChart3 size={18} />}
					onClick={() =>
						navigate(
							`/admin/grafica?year=${currentDate.getFullYear()}&month=${currentDate.getMonth()}`,
						)
					}
					sx={{
						borderRadius: 4,
						textTransform: "none",
						fontWeight: 500,
						px: 3,
						py: 1,
					}}
				>
					Ver gráfica de clases
				</Button>
			</div>
		</div>
	);
}

import { useEffect, useState } from "react";
import calendar from "../assets/calendar.png";
import { useIsMobile } from "../hooks/useIsMobile";
import {
	CalendarioAutoescuela,
	refreshHolidays,
} from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";
import { useUser } from "reactfire";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { ClasesChart } from "./ClasesChart";
import {
	BarChart3,
	LogOut as LogOutIcon,
	User,
	Mail,
	ArrowLeft,
} from "lucide-react";
import LoadingScreen from "./LoadingScreen";

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


	useEffect(() => {
		if (!user?.email || isLoadingSettings) return;

		const saveJornada = async () => {
			const email = user?.email ?? "noemail";
			const docRef = doc(db, "userSettings", email);
			await setDoc(docRef, { jornada }, { merge: true });
		};

		saveJornada();
	}, [jornada, user, isLoadingSettings]);

	const navigate = useNavigate();
	const [params] = useSearchParams();

	useEffect(() => {
		const year = parseInt(params.get("year") ?? "");
		const month = parseInt(params.get("month") ?? "");
		if (!isNaN(year) && !isNaN(month)) {
			setCurrentDate(new Date(year, month, 1));
		}
	}, [params]);


	const [vacationNumber, setVacationNumber] = useState<Record<string, number>>(
		{},
	);

	const onVacationChange = async (days: number) => {
		if (!user?.email) return;

		const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
		const updatedVacationNumber = { ...vacationNumber, [key]: days };
		setVacationNumber(updatedVacationNumber);

		refreshHolidays(days, currentDate);

		const email = user?.email ?? "unknown";
		const docRef = doc(db, "holidaysPerMonth", email);
		await setDoc(docRef, updatedVacationNumber, { merge: true });
	};


	useEffect(() => {
		if (!user?.email) return;

		const loadUserData = async () => {
			const email = user?.email ?? "noemail";

			
			const docRef = doc(db, "holidaysPerMonth", email);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				if (data && typeof data === "object") {
					setVacationNumber(data as Record<string, number>);
				}
			}

			
			const settingsRef = doc(db, "userSettings", email);
			const settingsSnap = await getDoc(settingsRef);
			if (settingsSnap.exists()) {
				const data = settingsSnap.data();
				if (data.jornada === "media" || data.jornada === "completa") {
					setJornada(data.jornada);
				} else {
					await setDoc(settingsRef, { jornada: "media" }, { merge: true });
					setJornada("completa");
				}
			} else {
				await setDoc(settingsRef, { jornada: "media" }, { merge: true });
				setJornada("completa");
			}

			setIsLoadingSettings(false);
		};

		loadUserData();
	}, [user]);


	useEffect(() => {
		if (!user) return;
		const classesCollectionRef = collection(
			db,
			"classespordia",
			user.email ?? "noemail",
			"dates",
		);
		getDocs(classesCollectionRef).then((querySnapshot) => {
			querySnapshot.docs.forEach((doc) => {
				const data = doc.data();
				const updatedCalendar = calendario.setClassCounter(
					new Date(data.date),
					data.count,
				);
				setCalendario(updatedCalendar);
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	
	const diasDelMes = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0,
	).getDate();

	const clasesPorDia = Array.from({ length: diasDelMes }, (_, i) => {
		const dia = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			i + 1,
		);
		return {
			dia: i + 1,
			total: calendario.calculateClassesForDate(dia),
		};
	});

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
				<ClasesChart clasesPorDia={clasesPorDia} />
			</div>
		);
	}

	
	const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
	const numberOfVacationForCurrentMonth = vacationNumber[key] ?? 0;

	return (
		<div
			className={`w-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-y-auto
  ${isMobile ? "px-4 pt-6 pb-10 space-y-4" : "px-12 pt-6 pb-10 space-y-6"}`}
		>
			<header
				className={`flex flex-col items-center relative text-center
  ${isMobile ? "mb-4 space-y-3" : "mb-8 space-y-6"}`}
			>
				{/* Fila superior */}
				<div
					className={`flex w-full items-center justify-between
    ${isMobile ? "flex-col gap-3 text-sm" : "flex-row px-8 mt-2 text-base"}`}
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
					className={`w-full object-contain mt-0 ${
						isMobile ? "max-w-[140px]" : "max-w-[230px] -translate-x-14"
					}`}
				/>
			</header>

			<section
				className={`bg-white rounded-xl shadow-md border border-gray-200 w-full 
  ${isMobile ? "p-0" : "p-6"}`}
			>
				<Month
					calendario={calendario}
					addClass={(day) => {
						const updated = calendario.addClass(day);
						setCalendario(updated);
					}}
					removeClass={(day) => {
						const updated = calendario.removeClass(day);
						setCalendario(updated);
					}}
					resetClass={(day) => {
						const updated = calendario.resetClass(day);
						setCalendario(updated);
					}}
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
							{
								date: day.toISOString(),
								count,
							},
							{ merge: true },
						);
					}}
					onMonthChange={(date) => setCurrentDate(date)}
					jornada={jornada}
					setJornada={setJornada}
					vacationNumber={numberOfVacationForCurrentMonth}
					onVacationChange={onVacationChange}
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

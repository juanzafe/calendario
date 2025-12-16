import {
	GoogleAuthProvider,
	getRedirectResult,
	signInWithPopup,
	signInWithRedirect,
	type UserCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { useAuth } from "reactfire";
import calendar from "../../assets/calendar.png";

const LoginWithGoogle: React.FC = () => {
	const auth = useAuth();

	// 🔹 Leemos el client ID desde el archivo .env
	const _googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

	useEffect(() => {
		// 🔹 Detectar si venimos de un redirect
		const checkRedirect = async () => {
			try {
				const result: UserCredential | null = await getRedirectResult(auth);
				if (result) {
				}
			} catch (error) {
				console.error("❌ Error en getRedirectResult:", error);
			}
		};
		checkRedirect();
	}, [auth]);

	const handleLogin = async (): Promise<void> => {
		const provider = new GoogleAuthProvider();

		try {
			await signInWithPopup(auth, provider);
		} catch (popupError) {
			console.warn("⚠️ Popup bloqueado, usando redirect:", popupError);
			try {
				await signInWithRedirect(auth, provider);
			} catch (_redirectError) {}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
			<img
				width={500}
				src={calendar}
				alt="calendario"
				className="mb-6 drop-shadow-lg rounded-2xl border border-gray-200"
			/>

			<button
				type="button"
				onClick={handleLogin}
				className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer px-8 py-6 hover:scale-105"
			>
				<img
					width={50}
					src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000.png"
					alt="google icon"
					className="mb-2 rounded-2xl"
				/>
				<h4 className="text-gray-700 font-medium text-lg">
					Iniciar sesión con Google
				</h4>
			</button>
		</div>
	);
};

export default LoginWithGoogle;

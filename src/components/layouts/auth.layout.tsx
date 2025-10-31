import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { useAuth, useSigninCheck } from "reactfire";
import LoadingScreen from "../LoadingScreen";
import calendar from "../../assets/calendar.png";

const AuthLayout: React.FC = () => {
	const auth = useAuth();
	const { status, data: signInCheckResult, hasEmitted } = useSigninCheck();

	const [checkingRedirect, setCheckingRedirect] = useState(true);
	const [authReady, setAuthReady] = useState(false);

	useEffect(() => {
		const restoreRedirectSession = async (): Promise<void> => {
			try {
				await getRedirectResult(auth);
			} catch (err) {
				console.error("Error restaurando sesión redirect:", err);
			} finally {
				setCheckingRedirect(false);
			}
		};
		restoreRedirectSession();
	}, [auth]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, () => {
			setAuthReady(true);
		});
		return () => unsubscribe();
	}, [auth]);

	if (status === "loading" || !hasEmitted || checkingRedirect || !authReady) {
		return <LoadingScreen message="Cargando..." logo={calendar} />;
	}

	if (signInCheckResult?.signedIn) {
		return <Navigate to="/admin" replace />;
	}

	return <Outlet />;
};

export default AuthLayout;

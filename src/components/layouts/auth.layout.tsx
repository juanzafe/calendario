import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { useAuth, useSigninCheck } from "reactfire";
import LoadingScreen from "../LoadingScreen";
import calendar from "../../assets/calendar.png";

const AuthLayout = () => {
  const auth = useAuth();
  const { status, data: signInCheckResult, hasEmitted } = useSigninCheck();

  // Estados locales
  const [checkingRedirect, setCheckingRedirect] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // 1️⃣ Espera explícita del redirect result
  useEffect(() => {
    const restoreRedirectSession = async () => {
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

  // 2️⃣ Listener directo de Firebase (garantiza detección correcta)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [auth]);

  // 3️⃣ Mostrar loading mientras Firebase o ReactFire no están listos
  if (status === "loading" || !hasEmitted || checkingRedirect || !authReady) {
    return <LoadingScreen message="Cargando..." logo={calendar} />;
  }

  // 4️⃣ Si ya hay usuario autenticado → ir a /admin
  if (signInCheckResult?.signedIn) {
    return <Navigate to="/admin" replace />;
  }

  // 5️⃣ Caso contrario → mostrar el login
  return <Outlet />;
};

export default AuthLayout;

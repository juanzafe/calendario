import { Suspense } from "react";
import { Navigate, Outlet } from "react-router";
import { useSigninCheck, useUser } from "reactfire";
import LoadingScreen from "../LoadingScreen";
import calendar from "../../assets/calendar.png";

const AdminLayout = () => {
  const { status, data: signInCheckResult, hasEmitted } = useSigninCheck();

  // 🔹 1) Cargando autenticación
  if (status === "loading" || !hasEmitted) {
    return <LoadingScreen message="Cargando aplicación..." logo={calendar} />;
  }

  // 🔹 2) Usuario no autenticado
  if (!signInCheckResult.signedIn) {
    return <Navigate to="/" replace />;
  }

  // 🔹 3) Layout autenticado
  return (
    <Suspense
      fallback={
        <LoadingScreen message="Cargando aplicación..." logo={calendar} />
      }
    >
      <AuthenticatedLayout />
    </Suspense>
  );
};

export default AdminLayout;

const AuthenticatedLayout = () => {
  useUser({ suspense: true });

  return (
    <div>
      <Outlet />
    </div>
  );
};

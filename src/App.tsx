import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./App.css";
import { useEffect } from "react";

import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "./firebase/firebase";

import AdminLayout from "./components/layouts/admin.layout";
import LoginWithGoogle from "./components/Login/LoginWithGoogle";
import RootLayout from "./components/layouts/root.layout";
import AuthLayout from "./components/layouts/auth.layout";
import { AppContainer } from "./components/AppContainer";
import { ClasesChartPage } from "./components/ClasesChart";


function usePageViews() {
  const location = useLocation();
  const analytics = getAnalytics(app);

  useEffect(() => {
    logEvent(analytics, "page_view", { page_path: location.pathname });
  }, [location, analytics]);
}

function App() {
  return (
    <BrowserRouter>
      <PageViewHandler /> {/* ✅ Hook aquí, dentro del Router */}
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            <Route index element={<LoginWithGoogle />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AppContainer />} />
            <Route path="grafica" element={<ClasesChartPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Componente vacío que solo ejecuta el hook
function PageViewHandler() {
  usePageViews();
  return null;
}

export default App;

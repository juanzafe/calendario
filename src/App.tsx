import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./App.css";

import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";
import { AppContainer } from "./components/AppContainer";
import ClasesChart from "./components/ClasesChart";
import LoginWithGoogle from "./components/Login/LoginWithGoogle";
import AdminLayout from "./components/layouts/admin.layout";
import AuthLayout from "./components/layouts/auth.layout";
import RootLayout from "./components/layouts/root.layout";
import { app } from "./firebase/firebase";

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
			<PageViewHandler />
			<Routes>
				<Route element={<RootLayout />}>
					<Route element={<AuthLayout />}>
						<Route index element={<LoginWithGoogle />} />
					</Route>

					<Route path="admin" element={<AdminLayout />}>
						<Route index element={<AppContainer />} />
						<Route path="grafica" element={<ClasesChart />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function PageViewHandler() {
	usePageViews();
	return null;
}

export default App;
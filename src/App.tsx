import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { AppContainer } from "./components/AppContainer";

import AdminLayout from "./components/layouts/admin.layout";
import LoginWithGoogle from "./components/Login/LoginWithGoogle";
import RootLayout from "./components/layouts/root.layout";
import AuthLayout from "./components/layouts/auth.layout";
import { ClasesChartPage } from "./components/ClasesChart";

function App() {
	return (
		<BrowserRouter>
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

export default App;

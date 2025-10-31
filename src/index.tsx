import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./firebase/firebaseService";
import { FirebaseAppProvider } from "reactfire";
import FirebaseServices from "./firebase/firebaseService";
import { BrowserRouter } from "react-router";
import { config } from "./firebase/firebase";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<FirebaseAppProvider firebaseConfig={config}>
			<FirebaseServices>
				<BrowserRouter></BrowserRouter>
				<App />
			</FirebaseServices>
		</FirebaseAppProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

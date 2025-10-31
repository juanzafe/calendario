// src/hooks/useHandleRedirect.ts
import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { useAuth } from "reactfire";

export function useHandleRedirect() {
	const auth = useAuth();

	useEffect(() => {
		console.log("📲 Revisando resultado de redirección global...");

		getRedirectResult(auth)
			.then((result) => {
				if (result?.user) {
					console.log("✅ Login por redirect:", result.user.email);
				} else {
					console.log(
						"ℹ️ No hay resultado de redirect (usuario ya logueado o sin redirect)",
					);
				}
			})
			.catch((error) => {
				console.error("❌ Error al procesar redirect:", error);
			});
	}, [auth]);
}

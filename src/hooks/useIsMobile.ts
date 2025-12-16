import { useCallback, useEffect, useState } from "react";

export const useIsMobile = () => {
	// Envuelve getIsMobile en useCallback
	const getIsMobile = useCallback(() => {
		return window.matchMedia("(max-width: 768px)").matches;
	}, []);

	const [isMobile, setIsMobile] = useState(getIsMobile);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(getIsMobile());
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [getIsMobile]);

	return isMobile;
};

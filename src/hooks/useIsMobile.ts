import { useEffect, useState } from "react";

export function useIsMobile() {
	const getIsMobile = () =>
		typeof window !== "undefined" ? window.innerWidth < 640 : false;

	const [isMobile, setIsMobile] = useState(getIsMobile);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(getIsMobile());
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return isMobile;
}

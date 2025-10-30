import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useAuth } from "reactfire";
import calendar from "../../assets/calendar.png";

const LoginWithGoogle = () => {
  const auth = useAuth();

  useEffect(() => {
    // 🔹 Verificar si venimos de un redirect
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("✅ Usuario autenticado vía redirect:", result.user);
        }
      } catch (error) {
        console.error("❌ Error en getRedirectResult:", error);
      }
    };
    checkRedirect();
  }, [auth]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      // Guardamos estado temporal de login
      localStorage.setItem("loginInProgress", "true");

      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      localStorage.removeItem("loginInProgress");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <img
        width="500"
        src={calendar}
        alt="calendario"
        className="mb-6 drop-shadow-lg rounded-2xl border border-gray-200"
      />

      <div
        onClick={handleLogin}
        className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer px-8 py-6 hover:scale-105"
      >
        <img
          width="50"
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000.png"
          alt="google icon"
          className="mb-2 rounded-2xl"
        />
        <h4 className="text-gray-700 font-medium text-lg">
          Iniciar sesión con Google
        </h4>
      </div>
    </div>
  );
};

export default LoginWithGoogle;

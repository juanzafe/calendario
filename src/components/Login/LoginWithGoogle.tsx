
import { getRedirectResult, GoogleAuthProvider , signInWithPopup, signInWithRedirect} from "firebase/auth";
import { useEffect } from "react";
import calendar from  "../../assets/calendar.png";
import { useAuth } from "reactfire";



const LoginWithGoogle = () => {
  const auth = useAuth();

  useEffect(() => {
    
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("User signed in successfully via redirect:", result.user);
        }
      } catch (error) {
        console.error("Error completing Google redirect sign-in:", error);
      }
    };
    checkRedirect();
  }, [auth]);

  const handleClickLoginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // 🔹 Detectar móvil (Android/iOS)
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // En móvil → redirección (para evitar bloqueo de pop-ups)
        await signInWithRedirect(auth, provider);
      } else {
        // En escritorio → pop-up normal
        await signInWithPopup(auth, provider);
      }

      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
    {/* Logo del calendario */}
    <img
      width="500"
      src={calendar}
      alt="calendario"
      className="mb-6 drop-shadow-lg rounded-2xl border border-gray-200"
    />

    {/* Contenedor del botón de login con Google */}
    <div
      onClick={handleClickLoginGoogle}
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
}

export default LoginWithGoogle;


import { GoogleAuthProvider , signInWithPopup} from "firebase/auth";

import { useAuth } from "reactfire";



const LoginWithGoogle = () => {
  const auth = useAuth();

  const handleClickLoginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div
        onClick={handleClickLoginGoogle}
        className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer px-8 py-6 hover:scale-105"
      >
        <img
          width="50"
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000.png"
          alt="google icon"
          className="mb-2"
        />
        <h4 className="text-gray-700 font-medium text-lg">
          Iniciar sesión con Google
        </h4>
      </div>
    </div>
  );
};

export default LoginWithGoogle;

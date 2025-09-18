
import { GoogleAuthProvider , signInWithPopup} from "firebase/auth";

import { useAuth } from "reactfire";



const LoginWithGoogle = () => {

  const auth=useAuth()

  const handleClickLoginGoogle = async () => {
    
    try{
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        console.log("User signed in successfully");
    }   catch(error){
        console.error("Error signing in with Google:")
    }
  }
  return (
    <div className="login-with-google">
      <p>--Or continue with--</p>
      <div className="google-login-card" onClick={handleClickLoginGoogle}>
        <img 
        width="100"
          src="https://developers.google.com/static/identity/images/branding_guide_dont_3.png"
          alt="google icon"
          />
          <h4>Sign up with google</h4>
      </div>
    </div>
  )
}
export default LoginWithGoogle

import { GoogleAuthProvider , signInWithPopup} from "firebase/auth";
import { auth } from "../../firebase/firebaseService";



const LoginWithGoogle = () => {

  const handleClickLoginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredentials = await signInWithPopup(auth, provider);
    console.log("====", userCredentials.user);
    if (!userCredentials.user) {
        throw new Error("The user couldn't sign in")
    }
    try{

    } catch (error){
      console.log(error)
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
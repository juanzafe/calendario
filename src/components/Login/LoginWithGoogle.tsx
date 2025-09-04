
import { browserLocalPersistence, GoogleAuthProvider , setPersistence, signInWithPopup} from "firebase/auth";
import { auth, db } from "../../firebase/firebaseService";
import { doc, setDoc} from "firebase/firestore"



const LoginWithGoogle = () => {

  const handleClickLoginGoogle = async () => {
    
    try{
        const provider = new GoogleAuthProvider();

    await setPersistence(auth, browserLocalPersistence);
    const userCredentials = await signInWithPopup(auth, provider);
    console.log("====", userCredentials.user);
    if (!userCredentials.user) {
        throw new Error("The user couldn't sign in")
    }


        const userRef =  doc(db, "users", userCredentials.user.uid)


        const email = userCredentials.user.email ?? "fakeemail@gmail.com";
        await setDoc(userRef, {
            username: email.split("@")[0],
            email: email,
            avatar:"default.png"
        })

       console.log("ya estamos listos")
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
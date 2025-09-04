import { auth } from "../../firebase/firebaseService"

const Logout = () => {

const handleClickLogout=()=>{
    auth.signOut()
}

    return (
    <div className="Logout"
    onClick={handleClickLogout}
    >Logout</div>
    
  )
}
export default Logout
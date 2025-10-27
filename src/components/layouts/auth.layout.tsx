import { Navigate, Outlet } from "react-router"
import { useSigninCheck } from "reactfire"
import LoadingScreen from "../LoadingScreen"
import calendar from "../../assets/calendar.png"


const AuthLayout = () => {


  const {status, data: signInCheckResult, hasEmitted}= useSigninCheck()


  if(status==="loading" || !hasEmitted){
    return <LoadingScreen message="Cargando3..." logo={calendar}/>
  }

  if(status === "success" && signInCheckResult.signedIn){
    return (
    <Navigate
    to="/admin"
    replace
      />
    )
  }


  return (
    <div>
      <Outlet/> 
    </div>
  )
}
export default AuthLayout
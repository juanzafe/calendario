import { Navigate, Outlet } from "react-router"
import { useSigninCheck } from "reactfire"

const AdminLayout = () => {

  const {status, data: signInCheckResult, hasEmitted}= useSigninCheck()


  if(status==="loading" || !hasEmitted){
    return <div>Loading...</div>
  }

  if(!signInCheckResult.signedIn){
    return <Navigate to="/auth/register" replace />
  }



  return (
    <div>
      <Outlet/>
    </div>
  )
}
export default AdminLayout
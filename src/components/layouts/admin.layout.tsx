import { Suspense } from "react"
import { Navigate, Outlet } from "react-router"
import { useSigninCheck, useUser } from "reactfire"

const AdminLayout = () => {

  const {status, data: signInCheckResult, hasEmitted}= useSigninCheck()


  if(status==="loading" || !hasEmitted){
    return <div>Loading...</div>
  }

  if(!signInCheckResult.signedIn){
    return <Navigate to="/" replace />
  }



  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <AuthenticatedLayout/>
    </Suspense>
  )
}
export default AdminLayout;


const AuthenticatedLayout = () => {
  useUser(
    {suspense: true}
  )

  return (
    <div>
      <Outlet/>
    </div>
  )
}

import { useEffect, useState } from "react";
import { CalendarioAutoescuela } from '../modelo/CalendarioAutoescuela';
import { Month } from "./Month";
import { useUser } from "reactfire";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Button } from "@mui/material";





export function AppContainer () {

  const {data: user} = useUser();
    console.log({user});
    const [calendario, setCalendario] = useState<CalendarioAutoescuela>(new CalendarioAutoescuela());
    const [currentDate, setCurrentDate] = useState(new Date());      

  

  const LogOut = () => {
  return (
    <div>
      <Button onClick={() => auth.signOut()}>Cerrar sesión</Button>
    </div>
  );
}


    useEffect(() => { 
      const classesCollectionRef = collection(db, "classespordia", "email", user!.email ?? "noemail");
      getDocs(classesCollectionRef).then((querySnapshot) => {
        console.log("==== querySnapshot", querySnapshot);
        querySnapshot.docs.forEach(doc => {
          const dateData = doc.data();
          console.log("=====", dateData)
          const updatedCalendar = calendario.setClassCounter(new Date(dateData.date), dateData.count);
          setCalendario(updatedCalendar);
        })
      });

    }
      , []);
    
    
    
    return (



    <div  className="AppContainer">
      <p>
        bienvenido, {user!.displayName||"Guest"}!
      </p>
      <p>
        Email: {user!.email || "Not provided"}
      </p>
        <Month calendario={calendario} 
        addClass={ day => {
            console.log("==== add class")
           
            const updatedCalendario = calendario.addClass(day);
setCalendario(updatedCalendario)
        }} 
        removeClass={(day: Date) => {
          
            const updatedCalendario = calendario.removeClass(day);
            setCalendario(updatedCalendario)
        }}
        resetClass={day => {
            const updatedCalendario = calendario.resetClass(day);
            setCalendario(updatedCalendario)
        }}/>
        <main>
           
           
           <LogOut/>
        </main>
        
    </div>
    )       
}









      



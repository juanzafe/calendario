
import { useEffect, useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";
import { useUser } from "reactfire";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";




export function AppContainer () {

  const {data: user} = useUser();
    console.log({user});
    const [calendario, setCalendario] = useState<CalendarioAutoescuela>(new CalendarioAutoescuela());

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
           <Contador calendario={calendario} />
           <DiasLaborales calendario={calendario} />
        </main>
        
    </div>
    )       
}

interface ContadorProps {
    calendario: CalendarioAutoescuela;
}
function Contador(props: ContadorProps) {
    return <div>
        {props.calendario.totalNumberOfClasses()}
         
        </div>
        
}

function DiasLaborales(props: ContadorProps){
    
        const [selectedNumber, setSelectedNumber] = useState<number | undefined>(undefined);
      
        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedNumber(Number(event.target.value));
        };
      
        return (
          <div>
            <label htmlFor="number-select">Dias laborables este mes:</label>
            <select id="number-select" value={selectedNumber ?? ''} onChange={handleChange}>
              <option value="" disabled>Elige un número</option>
              {[...Array(25)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
      
            {selectedNumber && (
              <p>objetivo del mes :{Math.round(selectedNumber * 7.8125)}</p>
            )}
           
           
          </div>
          
        );
      };
      
      



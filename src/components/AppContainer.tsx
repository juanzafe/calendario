
import { useState } from "react";
import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { Month } from "./Month";



export function AppContainer () {
    const [calendario, setCalendario] = useState<CalendarioAutoescuela>(new CalendarioAutoescuela());
    
    return (
    <div  className="AppContainer">
        <Month calendario={calendario} 
        addClass={ day => {
            console.log("==== add class")
           
            const updatedCalendario = calendario.addClass(day);
setCalendario(updatedCalendario)
        }} 
        removeClass={(day: Date) => {
          
            const updatedCalendario = calendario.removeClass(day);
            setCalendario(updatedCalendario)
        }}/>
        <main>
           <Contador calendario={calendario} />
        </main>
        
    </div>
    )       
}

interface ContadorProps {
    calendario: CalendarioAutoescuela;
}
function Contador(props: ContadorProps) {
    return <div>{props.calendario.totalNumberOfClasses()}</div>
}


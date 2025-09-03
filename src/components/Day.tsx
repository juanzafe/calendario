import { CalendarioAutoescuelaProps } from './Month';

type DayProps = {
    num: Date
    calendarioAutoescuelaProps: CalendarioAutoescuelaProps 
}


    


export function Day (props: DayProps){

    const { num, calendarioAutoescuelaProps } = props;

    const clasesDelDia = calendarioAutoescuelaProps.calendario.calculateClassesForDate(num);
    
    const getClassByCantidad = (cantidad: number): string => {
      if (cantidad < 8) return "pocas-clases";
      return "muchas-clases";
    }

    return <div className={`Day ${getClassByCantidad(clasesDelDia)}`} key={props.num.toDateString()}
               
    >
    <button onClick={()=>{
        props.calendarioAutoescuelaProps.addClass(props.num)
    }}>⬆️</button>
    <button onClick={()=>{
        props.calendarioAutoescuelaProps.removeClass(props.num)
    }}>⬇️</button>
    {props.num.getDate()} {props.calendarioAutoescuelaProps.calendario.calculateClassesForDate(props.num)} 
    <button onClick={()=>props.calendarioAutoescuelaProps.resetClass(props.num)}>RESET</button>
    
     </div>


    
   

    

    
}




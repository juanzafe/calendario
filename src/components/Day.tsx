import { CalendarioAutoescuelaProps } from './Month';

type DayProps = {
    num: Date
    calendarioAutoescuelaProps: CalendarioAutoescuelaProps 
}

export function Day (props: DayProps){
    return <div className="Day" key={props.num.toDateString()}
        
        onClick={() => {
            props.calendarioAutoescuelaProps.addClass(props.num)
        }}
        onDoubleClick={() => {
            console.log("==== on double click")
            props.calendarioAutoescuelaProps.removeClass(props.num)
            props.calendarioAutoescuelaProps.removeClass(props.num)
            props.calendarioAutoescuelaProps.removeClass(props.num)

        }
        }
        
    >{props.num.getDate()} 
    {props.calendarioAutoescuelaProps.calendario.calculateClassesForDate(props.num)}
    
     </div>


    
   

    

    
}




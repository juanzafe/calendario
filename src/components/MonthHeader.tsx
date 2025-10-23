import { DayHeader } from "./DayHeader";
import { CalendarioAutoescuelaProps } from "./Month";

export function MonthHeader (props: CalendarioAutoescuelaProps) {

    return (
      
      <div className="MonthHeader">
        
        <DayHeader label={"L"} /> 
        <DayHeader label={"M"} /> 

        <DayHeader label={"X"} /> 

        <DayHeader label={"J"} /> 

        <DayHeader label={"V"} /> 
        <DayHeader label={"S"} /> 
        <DayHeader label={"D"} /> 

      </div>
    );
}

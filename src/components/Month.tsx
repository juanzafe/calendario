import { CalendarioAutoescuela } from "../modelo/CalendarioAutoescuela";
import { DaysContainer } from "./DaysContainer";
import { MonthHeader } from "./MonthHeader";

export interface CalendarioAutoescuelaProps {
  calendario: CalendarioAutoescuela;
  addClass: (day: Date) => void;
  removeClass: (day: Date) => void;
  resetClass: (day: Date) => void;
}

export function Month (props: CalendarioAutoescuelaProps) {

    return (
      <div>
        <MonthHeader {...props}/>
        <DaysContainer {...props}/>
      </div>
    );
}
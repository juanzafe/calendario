import { db, auth } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore"; 

function refresh(count:number, date:Date){
    setDoc(doc(db, "classespordia", "email", auth.currentUser?.email ?? "noemail",date.toISOString()), {
        count: count,
        date: date.toISOString(),
    });
}

export class CalendarioAutoescuela {
    getClassesByDay(currentDate: Date) {
      throw new Error("Method not implemented.");
    }



    constructor(private readonly classes = new Map<number, number>()) {}

    addClass(day: Date): CalendarioAutoescuela {
        const currentCounterValue = this.classes.get(getStartOfDay(day)) ?? 0;
        const newCounterValue = currentCounterValue + 1;
        console.log("Añadiendo clase al día ", day, currentCounterValue, newCounterValue)
        this.classes.set(getStartOfDay(day), newCounterValue)
        
       refresh(newCounterValue, day);


        return new CalendarioAutoescuela(this.classes);
    }

    setClassCounter(day: Date, count: number): CalendarioAutoescuela {
        this.classes.set(getStartOfDay(day), count)
        return new CalendarioAutoescuela(this.classes);

    }

    removeClass(day: Date): CalendarioAutoescuela {
        const currentCounterValue = this.classes.get(getStartOfDay(day)) ?? 0;
        let newCounterValue = currentCounterValue - 1;
        newCounterValue = newCounterValue >0 ? newCounterValue : 0;
        this.classes.set(getStartOfDay(day), newCounterValue)

        refresh(newCounterValue, day);

        return new CalendarioAutoescuela(this.classes);
    }

    resetClass(day:Date): CalendarioAutoescuela {
        let newCounterValue = 0;
        this.classes.set(getStartOfDay(day), newCounterValue)

        refresh(newCounterValue, day);
        return new CalendarioAutoescuela(this.classes)

        
    }

     totalNumberOfClasses(dia: Date): number {
    const key = getStartOfDay(dia);
    return this.classes.get(key) ?? 0;
  }

    totalNumberOfClassesInMonth(date: Date): number {
    let numberOfClasses = 0;

    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();

    this.classes.forEach((value, key) => {
        const dayDate = new Date(key); 
        if (dayDate.getFullYear() === targetYear &&
            dayDate.getMonth() === targetMonth) {
            numberOfClasses += value;
        }
    });

    return numberOfClasses;
}




    calculateClassesForDate(day: Date): number {
        const classesForDay = this.classes.get(getStartOfDay(day)) ?? 0;
        return classesForDay
    }

    toJSON(){
        return {classes: this.classes}
    }
}

function getStartOfDay(date: Date): number {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay.getTime(); 
}
  
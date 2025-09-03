export class CalendarioAutoescuela {

    constructor(private readonly classes = new Map<number, number>()) {}

    addClass(day: Date): CalendarioAutoescuela {
        const currentCounterValue = this.classes.get(getStartOfDay(day)) ?? 0;
        const newCounterValue = currentCounterValue + 1;
        console.log("Añadiendo clase al día ", day, currentCounterValue, newCounterValue)
        this.classes.set(getStartOfDay(day), newCounterValue)
        return new CalendarioAutoescuela(this.classes);
    }

    removeClass(day: Date): CalendarioAutoescuela {
        const currentCounterValue = this.classes.get(getStartOfDay(day)) ?? 0;
        let newCounterValue = currentCounterValue - 1;
        newCounterValue = newCounterValue >0 ? newCounterValue : 0;
        this.classes.set(getStartOfDay(day), newCounterValue)
        return new CalendarioAutoescuela(this.classes);
    }

    resetClass(day:Date): CalendarioAutoescuela {
        let newCounterValue = 0;
        this.classes.set(getStartOfDay(day), newCounterValue)
        return new CalendarioAutoescuela(this.classes)
    }

    totalNumberOfClasses(): number {
        var numberOfClasses = 0;
        this.classes.forEach((value) => { 
            numberOfClasses += value;
        });
        return numberOfClasses;
    }
    calculateClassesForDate(day: Date): number {
        const classesForDay = this.classes.get(getStartOfDay(day)) ?? 0;
        return classesForDay
    }
}

function getStartOfDay(date: Date): number {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay.getDate();
  }
  
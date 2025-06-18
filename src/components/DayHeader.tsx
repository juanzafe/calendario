type DayHeaderProps = {
    label:string;
}

export function DayHeader(props:DayHeaderProps) {
    const label = props.label.toUpperCase();
    return <div className="DayHeader">{label}</div>
}
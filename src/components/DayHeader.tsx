type DayHeaderProps = {
  label: string;
};

export function DayHeader({ label }: DayHeaderProps) {
  return (
    <div className="flex items-center justify-center h-12 border border-green-600 bg-green-800 text-white hover:bg-green-600 transition-colors duration-200">
      {label}
    </div>
  );
}

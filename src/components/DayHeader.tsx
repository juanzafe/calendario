type DayHeaderProps = {
  label: string;
};

export function DayHeader({ label }: DayHeaderProps) {
  return (
    <div className="flex items-center justify-center h-8 sm:h-10 border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-medium hover:bg-emerald-100 transition-colors duration-200">
      {label}
    </div>
  );
}

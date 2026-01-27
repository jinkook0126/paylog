import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

function MonthSelector({
  currentDate,
  onDateChange,
}: {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const handlePrevMonth = () => {
    onDateChange(dayjs(currentDate).subtract(1, 'month').toDate());
  };
  const handleNextMonth = () => {
    onDateChange(dayjs(currentDate).add(1, 'month').toDate());
  };
  return (
    <div className="flex items-center justify-center gap-4 ">
      <button
        type="button"
        onClick={handlePrevMonth}
        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-lg font-semibold min-w-[120px] text-center">
        {dayjs(currentDate).format('YYYY년 M월')}
      </span>

      <button
        type="button"
        onClick={handleNextMonth}
        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
export default MonthSelector;

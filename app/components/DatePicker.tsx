import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import dayjs from '~/lib/dayjs';

function DatePicker({ date, onChange }: { date: Date; onChange: (date: Date) => void }) {
  const [open, setOpen] = useState(false);
  const handleChange = (selectedDate: Date) => {
    console.log('date', selectedDate);
    onChange(selectedDate);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-full justify-start text-left font-normal h-12"
        >
          <CalendarIcon />
          {dayjs(date).format('YYYY-MM-DD')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
          required
          timeZone="Asia/Seoul"
          locale={ko}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;

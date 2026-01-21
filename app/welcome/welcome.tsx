import { Calendar } from "~/components/ui/calendar"
import { useState } from "react";

export function Welcome() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />
    </main>
  );
}


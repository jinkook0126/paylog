import { useState } from "react"
import MonthSelector from "~/components/MonthSelector"
import dayjs from "~/lib/dayjs"
import StatsContent from "~/components/stats/StatsContent"
import MonthlyExpenseChart from "~/components/stats/MonthlyExpenseChart";

function SettingView() {
  const [currentDate, setCurrentDate] = useState<Date>(dayjs().toDate());
  const onDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  return (
    <div className="space-y-6">
      <MonthSelector currentDate={currentDate} onDateChange={onDateChange} />
      <MonthlyExpenseChart currentDate={currentDate}/>
      <StatsContent currentDate={currentDate} />
    </div>
  )
}

export default SettingView
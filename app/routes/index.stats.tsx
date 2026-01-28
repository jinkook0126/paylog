import { Suspense, useState } from 'react';
import MonthSelector from '~/components/MonthSelector';
import dayjs from '~/lib/dayjs';
import StatsContent from '~/components/stats/StatsContent';
import MonthlyExpenseChart from '~/components/stats/MonthlyExpenseChart';
import MonthlyChartSkeleton from '~/components/stats/MonthlyChartSkeleton';
import StatsContentSkeleton from '~/components/stats/StatsContentSkeleton';

function SettingView() {
  const [currentDate, setCurrentDate] = useState<Date>(dayjs().toDate());
  const onDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  return (
    <div className="space-y-6">
      <MonthSelector currentDate={currentDate} onDateChange={onDateChange} />
      <Suspense fallback={<MonthlyChartSkeleton />}>
        <MonthlyExpenseChart currentDate={currentDate} />
      </Suspense>
      <Suspense fallback={<StatsContentSkeleton />}>
        <StatsContent currentDate={currentDate} />
      </Suspense>
    </div>
  );
}

export default SettingView;

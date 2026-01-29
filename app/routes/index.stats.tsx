import { Suspense, useState } from 'react';
import { useLoaderData, type MetaFunction } from 'react-router';
import MonthSelector from '~/components/MonthSelector';
import dayjs from '~/lib/dayjs';
import StatsContent from '~/components/stats/StatsContent';
import MonthlyExpenseChart from '~/components/stats/MonthlyExpenseChart';
import MonthlyChartSkeleton from '~/components/stats/MonthlyChartSkeleton';
import StatsContentSkeleton from '~/components/stats/StatsContentSkeleton';

console.log('[stats module evaluated]');

export const meta: MetaFunction = () => [
  { title: 'paylog - 통계' },
  { name: 'description', content: 'paylog의 통계 페이지입니다.' },
];

export async function loader() {
  const month = dayjs().format('YYYY-MM');
  return { month };
}
function SettingView() {
  const { month } = useLoaderData<typeof loader>();
  const [currentDate, setCurrentDate] = useState<Date>(dayjs(month).toDate());
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

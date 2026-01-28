import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart';
import dayjs from '~/lib/dayjs';
import { useGetStatsQuery } from '~/query/stats';

export const description = 'An area chart with gradient fill';

const chartConfig = {
  card: {
    label: '카드',
  },
  cash: {
    label: '현금',
  },
} satisfies ChartConfig;

function MonthlyExpenseChart({ currentDate }: { currentDate: Date }) {
  const queryYear = dayjs(currentDate).format('YYYY');
  const { data: stats } = useGetStatsQuery(queryYear);
  return (
    <div className="rounded-2xl p-4 border border-border/50">
      <p className="text-sm font-medium text-muted-foreground mb-4">{queryYear}년 월별 지출 추이</p>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={stats}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} tickCount={6} axisLine={false} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} tickCount={4} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="cash"
            stackId="a"
            fill="var(--color-primary-background)"
            radius={[0, 0, 0, 0]}
          />
          <Bar dataKey="card" stackId="a" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default MonthlyExpenseChart;

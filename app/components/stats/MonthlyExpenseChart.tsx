import { Suspense } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import dayjs from "~/lib/dayjs"
import { useGetStatsQuery } from "~/query/stats"

export const description = "An area chart with gradient fill"

const chartConfig = {
  card: {
    label: "카드",
    color: "var(--chart-1)",
  },
  cash: {
    label: "현금",
    color: "var(--chart-2)",
  }
} satisfies ChartConfig


function MonthlyExpenseChart({ currentDate }: { currentDate: Date }) {
  const queryMonth = dayjs(currentDate).format('YYYY');
  const { data: stats } = useGetStatsQuery(queryMonth);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="rounded-2xl p-4 border border-border/50">
        <p className="text-sm font-medium text-muted-foreground mb-4">{queryMonth}년 월별 지출 추이</p>
        <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={stats}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            tickCount={6}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickCount={4}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="cash"
            stackId="a"
            fill="var(--color-chart-1)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="card"
            stackId="a"
            fill="var(--color-chart-2)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
        </ChartContainer>
      </div>
    </Suspense>
  )
}

export default MonthlyExpenseChart
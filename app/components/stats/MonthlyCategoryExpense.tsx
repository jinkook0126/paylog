import type { ITransactionList } from "~/databases/transaction";

function MonthlyCategoryExpense({ list }: { list: ITransactionList[] }) {
  const totalExpense = list.reduce((acc, item) => {
    if (item.categories.type === 'expense') {
      return acc + item.amount;
    }
    return acc;
  }, 0);

  const groupedCategories = list.filter((item) => item.categories.type === 'expense').reduce((acc, item) => {
    if(Object.hasOwn(acc, item.categories.id)) {
      acc[item.categories.id].amount += item.amount;
    } else {
      acc[item.categories.id] = {
        amount: item.amount,
        name: item.categories.name,
        icon: item.categories.icon,
      };
    }
    return acc;
  }, {} as Record<number, { amount: number, name: string, icon: string }>);
  const stats = Object.values(groupedCategories).map((category) => ({
    ...category,
    percentage: totalExpense > 0 ? (category.amount / totalExpense) * 100 : 0,
  })).sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="rounded-2xl p-4 border border-border/50">
      <p className="text-sm font-medium text-muted-foreground mb-4 px-2">카테고리별 지출</p>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.name} className="px-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="font-medium">{stat.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{stat.amount.toLocaleString()}원</p>
                <p className="text-xs text-muted-foreground">
                  {stat.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthlyCategoryExpense

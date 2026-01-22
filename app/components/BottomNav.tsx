import { House, List, Plus, ChartNoAxesCombined, Settings } from "lucide-react";
import { useBottomTabNavigationState, useBottomTabNavigationUpdate } from "~/context/BottomTabNavigationProvider";
import type { TScreen } from "~/context/BottomTabNavigationProvider";
import { cn } from "~/lib/utils";

type NavItem = {
  id: TScreen;
  icon: typeof House;
  label: string;
};

const navItems: NavItem[] = [
  { id: 'home', icon: House, label: '홈' },
  { id: 'transactions', icon: List, label: '내역' },
  { id: 'add', icon: Plus, label: '추가' },
  { id: 'stats', icon: ChartNoAxesCombined, label: '통계' },
  { id: 'settings', icon: Settings, label: '설정' },
];

function BottomNav() {
  const { currentTab } = useBottomTabNavigationState();
  const { setCurrentTab } = useBottomTabNavigationUpdate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border safe-area-pb">
       <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isAdd = item.id === 'add';

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200",
                isAdd && "relative -top-4",
                isActive && !isAdd && "text-primary",
                !isActive && !isAdd && "text-muted-foreground"
              )}
            >
              {isAdd ? (
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-card-lg">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  )
}

export default BottomNav
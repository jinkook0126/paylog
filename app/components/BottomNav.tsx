import { House, List, Plus, ChartNoAxesCombined, Settings } from "lucide-react";
import { NavLink } from "react-router";
import type { TScreen } from "~/context/BottomTabNavigationProvider";
import { cn } from "~/lib/utils";
import TransactionDrawer from "./transaction/TransactionDrawer";

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
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border safe-area-pb">
       <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if(item.id === 'add') {
            return (
              <TransactionDrawer key={item.id} />
            )
          }

          return (
            <NavLink
              to={item.id === 'home' ? '/' : `/${item.id}`}
              key={item.id}
              className={({isActive}: {isActive: boolean})=>cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200",
                isActive && "text-primary",
                !isActive && "text-muted-foreground",
                isActive && "[&_svg]:scale-110"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  )
}

export default BottomNav
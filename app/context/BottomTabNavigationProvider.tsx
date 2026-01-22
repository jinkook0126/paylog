import { createContext, useContext, useMemo, useState } from "react";

export type TScreen = 'home' | 'transactions' | 'add' | 'stats' | 'settings';

const BottomTabNavigationContext = createContext<{ currentTab: TScreen }>({ currentTab: 'home' });

const BottomTabNavigationUpdateContext = createContext<
  | {
      setCurrentTab: (tab: TScreen) => void;
    }
  | undefined
>(undefined);

export const useBottomTabNavigationState = () => {
  const context = useContext(BottomTabNavigationContext);
  if (!context) {
    throw new Error('useBottomTabNavigation must be used within a BottomTabNavigationProvider');
  }
  return context;
}
export const useBottomTabNavigationUpdate = () => {
  const context = useContext(BottomTabNavigationUpdateContext);
  if (!context) {
    throw new Error('useBottomTabNavigationUpdate must be used within a BottomTabNavigationProvider');
  }
  return context;
}


export function BottomTabNavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentTab, setCurrentTab] = useState<TScreen>('home');

  const value = useMemo(() => ({ currentTab }), [currentTab]);
  const updateValue = useMemo(() => ({ setCurrentTab }), [setCurrentTab]);

  return (
    <BottomTabNavigationContext.Provider value={value}>
      <BottomTabNavigationUpdateContext.Provider value={updateValue}>
        {children}
      </BottomTabNavigationUpdateContext.Provider>
    </BottomTabNavigationContext.Provider>
  );
}

export const useBottomTabNavigation = () => ({
  useBottomTabNavigationState,
  useBottomTabNavigationUpdate,
  BottomTabNavigationProvider,
})
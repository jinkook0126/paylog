import MobileLayout from "~/components/MobileLayout";
import BottomNav from "~/components/BottomNav";
import { BottomTabNavigationProvider } from "~/context/BottomTabNavigationProvider";

function Main() {
  return (
    <MobileLayout>
      <BottomTabNavigationProvider>
        <main>
          <h1>Index</h1>
        </main>
        <BottomNav />  
      </BottomTabNavigationProvider>
    </MobileLayout>
  )
}

export default Main
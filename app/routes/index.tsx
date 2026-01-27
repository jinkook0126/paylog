import { Outlet } from "react-router"
import BottomNav from "~/components/BottomNav"
import MobileLayout from "~/components/MobileLayout"
import TransactionModal from "~/components/transaction/TransactionModal"

const index = () => (
  <MobileLayout>
    <main>
      <div className="px-4 pt-6 pb-24">
        <Outlet />
      </div>
    </main>
    <BottomNav />
    <TransactionModal />
  </MobileLayout>
)

export default index
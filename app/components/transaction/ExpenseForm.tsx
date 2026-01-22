import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

function ExpenseForm() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' >('card');
  return (
    <div>
      <p className="text-stone-500 text-md mb-2">결제 수단</p>
      <div className="flex items-center gap-2 mb-6">
            <Button variant="subtle" className={cn("flex-1 py-6 text-lg font-medium", paymentMethod === 'card' && "bg-primary text-white")} onClick={() => setPaymentMethod('card')}>카드</Button>
            <Button variant="subtle" className={cn("flex-1 py-6 text-lg font-medium", paymentMethod === 'cash' && "bg-primary text-white")} onClick={() => setPaymentMethod('cash')}>현금</Button>
          </div>
    </div>
  )
}

export default ExpenseForm
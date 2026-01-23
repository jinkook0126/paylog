import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Banknote, X , Camera } from 'lucide-react'
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { getCategories } from "~/databases/category";
import { Input } from "../ui/input";

interface TransactionDrawerFormProps {
  setOpen: (open: boolean) => void;
  transactionType: 'expense' | 'income';
}

function TransactionDrawerForm({ setOpen, transactionType }: TransactionDrawerFormProps) {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' >('card');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const removeImage = () => {
    setImageUrl(undefined);
  };
  return (
    <div>
      {
        transactionType === 'expense' && (
        <div className="mb-6">
          <p className="text-stone-500 text-md mb-2">결제 수단</p>
          <div className="flex items-center gap-2">
            <Button variant="subtle" className={cn("flex-1 py-5 text-md font-medium items-center gap-2", paymentMethod === 'card' && "bg-primary text-primary-foreground")} onClick={() => setPaymentMethod('card')}>
              <CreditCard className="w-4 h-4" />
              카드
            </Button>
            <Button variant="subtle" className={cn("flex-1 py-5 text-md font-medium items-center gap-2", paymentMethod === 'cash' && "bg-primary text-primary-foreground")} onClick={() => setPaymentMethod('cash')}>
              <Banknote className="w-4 h-4" />
              현금
            </Button>
          </div>
        </div>
        )
      }
      <div className="mb-6">
        <p className="text-stone-500 text-md mb-2">금액</p>
        <div className="relative">
          <Input type="number"className="text-xl font-bold h-12 pr-8 text-right" inputMode="numeric" placeholder="0"/>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 text-md">
            원
          </span>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-stone-500 text-md mb-2">카테고리</p>
        <div className="grid grid-cols-4 gap-3">
          {categories?.filter((category) => category.type === transactionType).map((category) => (
            <button type="button" key={category.id} className={cn("flex flex-col items-center gap-2 p-3 rounded-xl transition-all bg-muted text-foreground", categoryId === category.id && "bg-primary text-primary-foreground")} onClick={() => setCategoryId(category.id)}>
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <p className="text-stone-500 text-md mb-2">내용</p>
        <Input type="text"className="text-lg h-12" placeholder="내용을 입력해주세요"/>
      </div>
      <div className="mb-6">
        <p className="text-stone-500 text-md mb-2">메모 (선택)</p>
        <Input type="text"className="text-lg h-12" placeholder="메모를 입력해주세요"/>
      </div>
      <div className="mb-6">
        <p className="text-stone-500 text-md mb-2">사진 (선택)</p>
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            // onChange={handleImageUpload}
            className="hidden"
          />
        {imageUrl ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={imageUrl} alt="첨부 이미지" className="w-full h-32 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">사진 추가</span>
          </button>
        )}
      </div>
      <Button onClick={() => setOpen(false)} variant="default" type="button" className="w-full h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed">추가하기</Button>
    </div>
  )
}

export default TransactionDrawerForm
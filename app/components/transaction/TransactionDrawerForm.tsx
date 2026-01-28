import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Banknote, X, Camera, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
import { getCategories } from '~/databases/category';
import { Input } from '../ui/input';
import { useAddTransactionMutation } from '~/query/transaction';
import { Field, FieldContent, FieldError } from '../ui/field';

interface TransactionDrawerFormProps {
  setOpen: (open: boolean) => void;
  transactionType: 'expense' | 'income';
}

const transactionSchema = z.object({
  paymentMethod: z.enum(['card', 'cash']).optional(),
  amount: z
    .number()
    .refine((val) => !Number.isNaN(val), {
      message: '금액을 입력해주세요',
    })
    .refine((val) => val > 0, {
      message: '금액은 0보다 커야 합니다',
    }),
  category: z.number().gt(0, {
    message: '카테고리를 선택해주세요',
  }),
  name: z.string().min(1, '내용을 입력해주세요').trim(),
  memo: z.string().optional(),
  picture: z.string().nullable().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

function TransactionDrawerForm({ setOpen, transactionType }: TransactionDrawerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { mutate: addTransactionMutate, isPending } = useAddTransactionMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      paymentMethod: 'card',
      amount: 0,
      category: 0,
      name: '',
      memo: '',
      picture: null,
    },
  });

  const picture = watch('picture');

  const removeImage = () => {
    setValue('picture', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    const payment = transactionType === 'expense' ? data.paymentMethod || 'card' : 'cash';
    addTransactionMutate(
      {
        category: data.category,
        amount: data.amount,
        paymentMethod: payment,
        picture: data.picture ?? null,
        memo: data.memo ?? null,
        name: data.name,
        created_at: new Date(),
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {transactionType === 'expense' && (
        <Field className="mb-6">
          <p className="text-stone-500 text-md">결제 수단</p>
          <FieldContent>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="subtle"
                    className={cn(
                      'flex-1 py-5 text-md font-medium items-center gap-2',
                      field.value === 'card' && 'bg-primary text-primary-foreground',
                    )}
                    onClick={() => field.onChange('card')}
                  >
                    <CreditCard className="w-4 h-4" />
                    카드
                  </Button>
                  <Button
                    type="button"
                    variant="subtle"
                    className={cn(
                      'flex-1 py-5 text-md font-medium items-center gap-2',
                      field.value === 'cash' && 'bg-primary text-primary-foreground',
                    )}
                    onClick={() => field.onChange('cash')}
                  >
                    <Banknote className="w-4 h-4" />
                    현금
                  </Button>
                </div>
              )}
            />
            <FieldError errors={errors.paymentMethod ? [errors.paymentMethod] : []} />
          </FieldContent>
        </Field>
      )}

      <Field className="mb-6">
        <p className="text-stone-500 text-md">금액</p>
        <FieldContent>
          <div className="relative">
            <Input
              type="number"
              className={cn(
                'text-xl font-bold h-12 pr-8 text-right',
                errors.amount && 'border-destructive',
              )}
              inputMode="numeric"
              placeholder="0"
              value={watch('amount') || ''}
              {...register('amount', {
                valueAsNumber: true,
                onChange: (e) => {
                  const { value } = e.target;
                  if (value === '' || Number.isNaN(Number(value))) {
                    setValue('amount', 0);
                  } else {
                    setValue('amount', Number(value));
                  }
                },
              })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 text-md">
              원
            </span>
          </div>
          <FieldError errors={errors.amount ? [errors.amount] : []} />
        </FieldContent>
      </Field>

      <Field className="mb-6">
        <p className="text-stone-500 text-md">카테고리</p>
        <FieldContent>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-3">
                {categories
                  ?.filter((cat) => cat.type === transactionType)
                  .map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl transition-all bg-muted text-foreground',
                        field.value === cat.id && 'bg-primary text-primary-foreground',
                      )}
                      onClick={() => field.onChange(cat.id)}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-medium">{cat.name}</span>
                    </button>
                  ))}
              </div>
            )}
          />
          <FieldError errors={errors.category ? [errors.category] : []} />
        </FieldContent>
      </Field>

      <Field className="mb-6">
        <p className="text-stone-500 text-md">내용</p>
        <FieldContent>
          <Input
            type="text"
            className={cn('text-lg h-12', errors.name && 'border-destructive')}
            placeholder="내용을 입력해주세요"
            {...register('name')}
          />
          <FieldError errors={errors.name ? [errors.name] : []} />
        </FieldContent>
      </Field>

      <Field className="mb-6">
        <p className="text-stone-500 text-md">메모 (선택)</p>
        <FieldContent>
          <Input
            type="text"
            className="text-lg h-12"
            placeholder="메모를 입력해주세요"
            {...register('memo')}
          />
        </FieldContent>
      </Field>

      <Field className="mb-6">
        <p className="text-stone-500 text-md mb-2">사진 (선택)</p>
        <FieldContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setValue('picture', reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {picture ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={picture} alt="첨부 이미지" className="w-full h-32 object-cover" />
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
        </FieldContent>
      </Field>

      <Button
        type="submit"
        variant="default"
        disabled={isPending}
        className="w-full h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '추가하기'}
      </Button>
    </form>
  );
}

export default TransactionDrawerForm;

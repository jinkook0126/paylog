import { Loader2, Plus } from "lucide-react"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "../ui/button"
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";
import { useAddCategoryMutation } from "~/query/category";

const EMOJI_OPTIONS = ['🍔', '☕', '🎬', '🏋️', '✈️', '🎵', '📱', '🎨', '🐕', '💼', '🏠', '🎓', '💝', '🌸', '⚽', '🍕'];

const categorySchema = z.object({
  type: z.enum(['expense', 'income']),
  name: z.string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 20자 이하여야 합니다')
    .trim(),
  icon: z.string()
    .min(1, '아이콘을 선택해주세요')
    .refine((val) => EMOJI_OPTIONS.includes(val), {
      message: '유효한 아이콘을 선택해주세요',
    }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

function CategoryAddDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: addCategoryMutate, isPending} = useAddCategoryMutation();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: 'expense',
      name: '',
      icon: '',
    },
  });

  const type = watch('type');
  const icon = watch('icon');

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: CategoryFormData) => {
    addCategoryMutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="bg-muted hover:bg-primary/10 cursor-pointer">
          <Plus className="w-4 h-4" />
          추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>카테고리 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue('type', 'expense')}
                  className={cn(
                    "flex-1 py-2 rounded-lg font-medium transition-all text-sm",
                    type === 'expense'
                      ? "bg-rose-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  지출
                </button>
                <button
                  type="button"
                  onClick={() => setValue('type', 'income')}
                  className={cn(
                    "flex-1 py-2 rounded-lg font-medium transition-all text-sm",
                    type === 'income'
                      ? "bg-indigo-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  수입
                </button>
              </div>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}

              <div>
                <span className="text-sm text-muted-foreground mb-1 block">이름</span>
                <Input
                  {...register('name')}
                  placeholder="카테고리 이름"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <span className="text-sm text-muted-foreground mb-2 block">아이콘</span>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setValue('icon', emoji)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                        icon === emoji
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {errors.icon && (
                  <p className="text-sm text-destructive mt-1">{errors.icon.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '추가하기'}
              </Button>
            </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryAddDialog
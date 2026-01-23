import { Loader2, Plus } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { Category } from "~/lib/prismaClient";
import { addCategory } from "~/databases/category";

const EMOJI_OPTIONS = ['🍔', '☕', '🎬', '🏋️', '✈️', '🎵', '📱', '🎨', '🐕', '💼', '🏠', '🎓', '💝', '🌸', '⚽', '🍕'];

function CategoryAddDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const queryClient = useQueryClient();
  const { mutate: addCategoryMutate, isPending} = useMutation({
    mutationFn: (category: Omit<Category, 'id'>) => addCategory(category),
    onMutate: (category: Omit<Category, 'id'>) => {
      queryClient.cancelQueries({ queryKey: ['categories'] });
      const previous = queryClient.getQueryData<Category[]>(['categories']);
      queryClient.setQueryData(['categories'], (old: Category[] | undefined) => [...(old ?? []), {...category, id: Date.now()}]);
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('카테고리 추가에 성공했습니다.');
    },
    onError: (error, category, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['categories'], context.previous);
      }
      toast.error('카테고리 추가에 실패했습니다.');
    },
    onSettled: () => {
      setOpen(false);
    },
  });
  const handleAdd = () => {
    addCategoryMutate({ type, name, icon });
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
        <div className="space-y-4 pt-4">
              <div className="flex gap-2">
                <button
                type="button"
                  onClick={() => setType('expense')}
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
                  onClick={() => setType('income')}
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

              <div>
                <span className="text-sm text-muted-foreground mb-1 block">이름</span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="카테고리 이름"
                />
              </div>

              <div>
                <span className="text-sm text-muted-foreground mb-2 block">아이콘</span>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setIcon(emoji)}
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
              </div>

              <Button onClick={handleAdd} className="w-full" disabled={!name.trim() || !icon || isPending}>
                
                {
                  isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '추가하기'
                }
              </Button>
            </div>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryAddDialog
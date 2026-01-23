import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { addCategory, deleteCategory, getCategories } from "~/databases/category";
import type { Category } from "~/lib/prismaClient";
import { queryClient } from "~/lib/query-client";

export const queryKey = ['categories'];

export function useGetCategoriesQuery(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey,
    queryFn: getCategories,
  });
}

export function useDeleteCategoryMutation(): UseMutationResult<void, Error, number> {
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Category[]>(queryKey);
      queryClient.setQueryData<Category[]>(queryKey, (old) =>
        (old ?? []).filter((category) => category.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error('카테고리 삭제에 실패했습니다.');
    },
    onSuccess: () => {
      toast.success('카테고리 삭제에 성공했습니다.');
    },
  });
}

export function useAddCategoryMutation(): UseMutationResult<Category, Error, Omit<Category, 'id'|'isActive'>> {
  return useMutation({
    mutationFn: (category: Omit<Category, 'id'|'isActive'>) => addCategory(category),
    onMutate: (category: Omit<Category, 'id'|'isActive'>) => {
      queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Category[]>(queryKey);
      queryClient.setQueryData(queryKey, (old: Category[] | undefined) => [...(old ?? []), {...category, id: Date.now()}]);
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('카테고리 추가에 성공했습니다.');
    },
    onError: (error, category, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error('카테고리 추가에 실패했습니다.');
    },
  });
}
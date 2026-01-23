import { useState } from "react";
import { ChevronUp, ChevronDown, Tag,  Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import CategoryAddDialog from "./CategoryAddDialog";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "~/query/category";

function CategoryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useGetCategoriesQuery();
  const { mutate: removeCategory } = useDeleteCategoryMutation();
  
  return (
    <Card size="sm" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-medium">카테고리 관리</CardTitle>
              <CardDescription className="text-sm">카테고리 추가/삭제</CardDescription>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </CardHeader>
      </button>
      {
        isOpen && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">카테고리 관리</h3>
                <CategoryAddDialog />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">지출 카테고리</p>
                <div className="bg-card rounded-xl space-y-2">
                  {categories?.filter((category) => category.type === 'expense').map((category) => (
                    <div key={category.id} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-medium">{category.name}</span>
                      </div>
                      {
                        category.id > 12 && (
                          <button
                            type="button"
                            onClick={() => removeCategory(category.id)}
                            className="p-2 text-muted-foreground hover:text-rose-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      }
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">수입 카테고리</p>
                <div className="bg-card rounded-xl space-y-2">
                  {categories?.filter((category) => category.type === 'income').map((category) => (
                    <div key={category.id} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-medium">{category.name}</span>
                      </div>
                      {
                        category.id > 12 && (
                          <button
                            type="button"
                            onClick={() => removeCategory(category.id)}
                            className="p-2 text-muted-foreground hover:text-rose-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )
      }
    </Card>
  )
}

export default CategoryManager
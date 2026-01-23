import { useState } from "react";
import { ChevronUp, ChevronDown, Tag } from "lucide-react"
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from "~/components/ui/card"

function AppVersion() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card size="sm"  className="overflow-hidden">
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
              <CardTitle className="text-base font-medium">앱 정보</CardTitle>
              <CardDescription className="text-sm">버전 및 정보</CardDescription>
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
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">버전</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">개발자</span>
                <span className="font-medium">또닥</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">라이선스</span>
                <span className="font-medium">MIT</span>
              </div>
            </div>
        </CardContent>
        )
      }
    </Card>
  )
}

export default AppVersion
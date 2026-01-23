
import AppVersion from "~/components/setting/AppVersion"
import CategoryManager from "~/components/setting/CategoryManager"

function SettingView() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">설정</h1>
      <div className="space-y-4">
        <CategoryManager />
        <AppVersion />
        <p className="text-center text-sm text-muted-foreground py-4">
          Made with 💚 by 또닥
      </p>
      </div>
    </div>
  )
}

export default SettingView
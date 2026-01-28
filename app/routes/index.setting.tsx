import type { MetaFunction } from 'react-router';
import AppVersion from '~/components/setting/AppVersion';
import CategoryManager from '~/components/setting/CategoryManager';

export const meta: MetaFunction = () => [
  { title: 'paylog - 설정' },
  { name: 'description', content: 'paylog의 설정 페이지입니다.' },
];

function SettingView() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">설정</h1>
      <div className="space-y-4">
        <CategoryManager />
        <AppVersion />
        <p className="text-center text-sm text-muted-foreground py-4">Made with 💚 by 또닥</p>
      </div>
    </div>
  );
}

export default SettingView;

import type { ReactNode } from 'react';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header>
        <div className="w-full max-w-3xl px-6 py-4">
          <AppBreadcrumb />
        </div>
      </header>

      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-3xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

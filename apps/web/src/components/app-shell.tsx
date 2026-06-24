'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { PlayerBar } from './player-bar';

const SHELL_EXCLUDED_PATHS = ['/login', '/register'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShellExcluded = SHELL_EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  if (isShellExcluded) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="ml-60 mb-20 flex-1 overflow-y-auto min-h-0">
        {children}
      </main>
      <PlayerBar />
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';

export function Sidebar(): ReactNode {
  return (
    <aside className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background">
      <nav className="flex flex-col gap-2 p-4">
        <span className="text-sm font-medium text-muted-foreground">Navigation</span>
      </nav>
    </aside>
  );
}

'use client';

import type { ReactNode } from 'react';

export function Header(): ReactNode {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold">GPBMT.ORG</span>
        </div>
      </div>
    </header>
  );
}

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export default function Home(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">GPBMT.ORG</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Buon Ma Thuot Diocese Management System
        </p>
        <div className="flex gap-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </main>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Header from '@/components/dominion/header';
import MissionsPanel from '@/components/dominion/missions-panel';
import FactionsPanel from '@/components/dominion/factions-panel';
import PlayerStats from '@/components/dominion/player-stats';
import MainPanel from '@/components/dominion/main-panel';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import BackgroundScene from '@/components/dominion/background-scene';

const ThreeScene = dynamic(() => import('@/components/dominion/three-scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-background">
      <Skeleton className="absolute w-full h-full" />
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="text-xl font-headline text-foreground">Generating Sector Map...</p>
        <p className="text-muted-foreground">Please wait while we render the galaxy.</p>
      </div>
    </div>
  ),
});

export type ViewMode = 'dashboard' | 'map';

export default function Home() {
  const [view, setView] = useState<ViewMode>('dashboard');

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 flex flex-col h-screen">
        <Header activeView={view} onNavigate={setView} />

        {view === 'dashboard' ? (
          <>
            <BackgroundScene />
            <main className="flex-1 overflow-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 z-10">
              <div className="lg:col-span-1 xl:col-span-1">
                <MissionsPanel />
              </div>
              <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4 lg:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  <FactionsPanel />
                  <PlayerStats />
                </div>
                <div className="flex-1">
                  <MainPanel />
                </div>
              </div>
            </main>
          </>
        ) : (
          <ThreeScene />
        )}
      </div>
    </div>
  );
}

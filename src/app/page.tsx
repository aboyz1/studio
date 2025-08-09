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
import { cn } from '@/lib/utils';

const ThreeScene = dynamic(() => import('@/components/dominion/three-scene'), {
  ssr: false,
  loading: () => <Skeleton className="absolute top-0 left-0 w-full h-full bg-background" />,
});

export type ViewMode = 'dashboard' | 'map';

export default function Home() {
  const [view, setView] = useState<ViewMode>('dashboard');

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className={cn('absolute inset-0 transition-opacity duration-500', view === 'dashboard' ? 'opacity-100' : 'opacity-0')}>
        <BackgroundScene />
      </div>
      <div className={cn('absolute inset-0 transition-opacity duration-500', view === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
        <ThreeScene />
      </div>
      
      <div className="absolute inset-0 flex flex-col h-screen">
        <Header activeView={view} onNavigate={setView} />
        {view === 'dashboard' && (
          <main className="flex-1 overflow-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
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
        )}
      </div>
    </div>
  );
}

'use client';

import { DominionIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { ViewMode } from '@/app/page';
import { cn } from '@/lib/utils';

type HeaderProps = {
  activeView: ViewMode;
  onNavigate: (view: ViewMode) => void;
};

export default function Header({ activeView, onNavigate }: HeaderProps) {
  const { wallet } = useWallet();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  return (
    <header className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center gap-4">
        <DominionIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline text-foreground tracking-wider">
          Dominion <span className="text-primary">3D</span>
        </h1>
      </div>
      <nav className="hidden md:flex items-center gap-2 lg:gap-4">
        <Button 
          variant={activeView === 'dashboard' ? 'secondary' : 'ghost'} 
          className="font-headline"
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </Button>
        <Button 
          variant={activeView === 'map' ? 'secondary' : 'ghost'} 
          className="font-headline"
          onClick={() => onNavigate('map')}
        >
          Map
        </Button>
        <Button variant="ghost" className="font-headline">Missions</Button>
        <Button variant="ghost" className="font-headline">Characters</Button>
        <Button variant="ghost" className="font-headline">Factions</Button>
        <Button variant="ghost" className="font-headline">Marketplace</Button>
      </nav>
      {isMounted ? (
          <WalletMultiButton style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            borderRadius: 'var(--radius)',
            fontFamily: '"Space Grotesk", sans-serif'
          }} />
      ) : (
        <Skeleton className="h-10 w-36" />
      )}
    </header>
  );
}

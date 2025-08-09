'use client';

import { DominionIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center gap-4">
        <DominionIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline text-foreground tracking-wider">
          Dominion <span className="text-primary">3D</span>
        </h1>
      </div>
      <nav className="hidden md:flex items-center gap-2 lg:gap-4">
        <Button variant="ghost" className="font-headline">Map</Button>
        <Button variant="ghost" className="font-headline">Missions</Button>
        <Button variant="ghost" className="font-headline">Characters</Button>
        <Button variant="ghost" className="font-headline">Factions</Button>
        <Button variant="ghost" className="font-headline">Marketplace</Button>
      </nav>
      <WalletMultiButton style={{
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: 'var(--radius)',
        fontFamily: '"Space Grotesk", sans-serif'
      }} />
    </header>
  );
}

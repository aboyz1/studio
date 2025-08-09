'use client';

import { Button } from '@/components/ui/button';
import { DominionIcon } from '@/components/icons';
import { Wallet, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      toast({
        title: "Wallet Disconnected",
        description: "Your Solana wallet has been disconnected.",
      });
    } else {
      // Simulate connecting
      toast({
        title: "Connecting Wallet...",
        description: "Please approve the connection in your wallet.",
      });
      setTimeout(() => {
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: "Solana wallet connected successfully.",
        });
      }, 2000);
    }
  };

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
      <Button onClick={handleConnect} variant="outline" className="font-headline border-primary/50 hover:bg-primary/10">
        {isConnected ? <Wallet className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </Button>
    </header>
  );
}

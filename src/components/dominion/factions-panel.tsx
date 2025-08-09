'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

type Faction = {
  name: 'The Cygnus Syndicate' | 'Orion Arm Collective';
  logo: string;
  hint: string;
  members: string;
  territories: number;
  color: string;
};

const factions: Faction[] = [
  {
    name: 'The Cygnus Syndicate',
    logo: 'https://placehold.co/80x80.png',
    hint: 'eagle emblem',
    members: '1,204',
    territories: 12,
    color: 'border-sky-400',
  },
  {
    name: 'Orion Arm Collective',
    logo: 'https://placehold.co/80x80.png',
    hint: 'lion emblem',
    members: '987',
    territories: 9,
    color: 'border-amber-400',
  },
];

export default function FactionsPanel() {
  const [selectedFaction, setSelectedFaction] = useState<Faction['name'] | null>(null);
  const [joinedFaction, setJoinedFaction] = useState<Faction['name'] | null>(null);
  const { toast } = useToast();

  const handleJoinFaction = () => {
    if (selectedFaction) {
      setJoinedFaction(selectedFaction);
      toast({
        title: "Faction Joined!",
        description: `You have officially aligned with ${selectedFaction}.`,
      });
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm xl:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-primary">Factions</CardTitle>
        <CardDescription>Align with a power to conquer the galaxy.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {factions.map((faction) => (
          <div
            key={faction.name}
            className={cn(
              `p-4 rounded-lg bg-card/50 flex items-center gap-4 border-l-4 transition-all relative`,
              faction.color,
              {
                'ring-2 ring-primary ring-offset-2 ring-offset-background': selectedFaction === faction.name,
                'cursor-pointer hover:bg-card/80': !joinedFaction,
                'opacity-50': joinedFaction && joinedFaction !== faction.name,
              }
            )}
            onClick={() => !joinedFaction && setSelectedFaction(faction.name)}
          >
            {joinedFaction === faction.name && (
              <div className="absolute top-2 right-2 bg-green-500 text-primary-foreground rounded-full p-1">
                <CheckCircle size={16} />
              </div>
            )}
            <Image src={faction.logo} alt={faction.name} width={50} height={50} data-ai-hint={faction.hint} className="rounded-full" />
            <div>
              <h3 className="font-headline text-md">{faction.name}</h3>
              <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                <span className="flex items-center gap-1"><Users size={12} /> {faction.members}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {faction.territories} Territories</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-6 pt-2">
        <Button
          className="w-full font-headline"
          disabled={!selectedFaction || !!joinedFaction}
          onClick={handleJoinFaction}
        >
          {joinedFaction ? `Aligned with ${joinedFaction}` : selectedFaction ? `Join ${selectedFaction}` : 'Select a Faction'}
        </Button>
      </div>
    </Card>
  );
}

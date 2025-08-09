'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, MapPin } from 'lucide-react';

const factions = [
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
  return (
    <Card className="bg-card/70 backdrop-blur-sm xl:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline text-primary">Factions</CardTitle>
        <CardDescription>Align with a power to conquer the galaxy.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factions.map((faction) => (
          <div key={faction.name} className={`p-4 rounded-lg bg-card/50 flex items-center gap-4 border-l-4 ${faction.color}`}>
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
    </Card>
  );
}

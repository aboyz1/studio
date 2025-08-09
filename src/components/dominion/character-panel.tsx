'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Gem, Swords, Shield, Heart } from 'lucide-react';

const characters = [
  {
    name: 'Cyber Ronin',
    level: 12,
    rarity: 'Epic',
    avatar: 'https://placehold.co/100x100.png',
    hint: 'cyberpunk warrior',
    stats: { attack: 85, defense: 70, health: 90 },
  },
  {
    name: 'Void Scout',
    level: 9,
    rarity: 'Rare',
    avatar: 'https://placehold.co/100x100.png',
    hint: 'stealthy astronaut',
    stats: { attack: 65, defense: 50, health: 75 },
  },
  {
    name: 'Mecha Guardian',
    level: 15,
    rarity: 'Legendary',
    avatar: 'https://placehold.co/100x100.png',
    hint: 'giant robot',
    stats: { attack: 95, defense: 98, health: 120 },
  },
  {
    name: 'Psionic Agent',
    level: 11,
    rarity: 'Epic',
    avatar: 'https://placehold.co/100x100.png',
    hint: 'telepathic spy',
    stats: { attack: 78, defense: 60, health: 85 },
  },
];

const rarityColor = {
    Epic: 'border-purple-500',
    Rare: 'border-blue-500',
    Legendary: 'border-yellow-500',
};

export default function CharacterPanel() {
  return (
    <Card className="h-full bg-transparent border-0 shadow-none">
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-22rem)] md:h-[calc(100vh-26rem)] lg:h-[calc(100vh-24rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
            {characters.map((char) => (
              <Card key={char.name} className="bg-card/70 backdrop-blur-sm overflow-hidden">
                <CardHeader className="p-4 flex flex-row items-center gap-4">
                  <Image
                    src={char.avatar}
                    alt={char.name}
                    width={64}
                    height={64}
                    data-ai-hint={char.hint}
                    className={`rounded-full border-2 ${rarityColor[char.rarity as keyof typeof rarityColor]}`}
                  />
                  <div>
                    <CardTitle className="text-lg font-headline">{char.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Lvl {char.level}</Badge>
                      <Badge variant="outline" className={`${rarityColor[char.rarity as keyof typeof rarityColor]} text-foreground`}>
                        {char.rarity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-muted-foreground"><Swords size={14}/> Attack</span> <span>{char.stats.attack}</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-muted-foreground"><Shield size={14}/> Defense</span> <span>{char.stats.defense}</span></div>
                    <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-muted-foreground"><Heart size={14}/> Health</span> <span>{char.stats.health}</span></div>
                  </div>
                  <Button className="w-full mt-4" variant="secondary">
                    <Gem className="mr-2" size={16} /> Upgrade
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Gem, Swords, Shield, Heart, Quote } from 'lucide-react';

type Character = {
    name: string;
    level: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    stats: {
        attack: number;
        defense: number;
        health: number;
    };
    backstory: string;
    imagePrompt: string;
};

const staticCharacters: Character[] = [
    {
        name: 'Jax "The Void"',
        level: 18,
        rarity: 'Legendary',
        stats: { attack: 95, defense: 80, health: 140 },
        backstory: 'A rogue pilot whose ship is rumored to be powered by a miniature black hole.',
        imagePrompt: 'cyberpunk pilot legendary'
    },
    {
        name: 'Seraphina',
        level: 15,
        rarity: 'Epic',
        stats: { attack: 80, defense: 65, health: 110 },
        backstory: 'A master strategist who can predict enemy movements with uncanny accuracy.',
        imagePrompt: 'female strategist epic'
    },
    {
        name: 'Grunt-7',
        level: 10,
        rarity: 'Rare',
        stats: { attack: 60, defense: 90, health: 120 },
        backstory: 'A genetically engineered super-soldier, loyal only to the highest bidder.',
        imagePrompt: 'armored super soldier rare'
    },
    {
        name: 'Rook',
        level: 8,
        rarity: 'Common',
        stats: { attack: 45, defense: 55, health: 90 },
        backstory: 'A scrappy mechanic who keeps the faction\'s ships flying with spit and grit.',
        imagePrompt: 'space mechanic common'
    },
];

const rarityColor: Record<string, string> = {
    Common: 'border-gray-400',
    Rare: 'border-blue-500',
    Epic: 'border-purple-500',
    Legendary: 'border-yellow-500',
};

function CharacterCard({ char }: { char: Character }) {
    return (
        <Card className="bg-card/70 backdrop-blur-sm overflow-hidden flex flex-col">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
                <Image
                    src={`https://placehold.co/100x100.png`}
                    alt={char.name}
                    width={64}
                    height={64}
                    data-ai-hint={char.imagePrompt}
                    className={`rounded-full border-2 ${rarityColor[char.rarity]}`}
                />
                <div>
                    <CardTitle className="text-lg font-headline">{char.name}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Lvl {char.level}</Badge>
                        <Badge variant="outline" className={`${rarityColor[char.rarity]} text-foreground`}>
                            {char.rarity}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
                <div>
                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-muted-foreground"><Swords size={14} /> Attack</span> <span>{char.stats.attack}</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-muted-foreground"><Shield size={14} /> Defense</span> <span>{char.stats.defense}</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-muted-foreground"><Heart size={14} /> Health</span> <span>{char.stats.health}</span></div>
                    </div>
                    <CardDescription className="text-xs italic flex gap-2"><Quote size={12} className="flex-shrink-0" /> {char.backstory}</CardDescription>
                </div>
                <Button className="w-full mt-4" variant="secondary">
                    <Gem className="mr-2" size={16} /> Upgrade
                </Button>
            </CardContent>
        </Card>
    );
}

export default function CharacterPanel() {
    return (
        <Card className="h-full bg-transparent border-0 shadow-none">
            <CardContent className="p-0 h-full flex flex-col">
                <ScrollArea className="h-[calc(100vh-23rem)] md:h-[calc(100vh-27rem)] lg:h-[calc(100vh-25rem)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
                        {staticCharacters.map((char) => <CharacterCard key={char.name} char={char} />)}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

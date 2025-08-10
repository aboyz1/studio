
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Gem, Swords, Shield, Heart, Quote } from 'lucide-react';

type Character = {
    mintAddress: string;
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

const sampleCharacters: Character[] = [
    {
        mintAddress: 'CHAR1_AdWgFv...89oG',
        name: 'Jax "The Void" Stryker',
        level: 18,
        rarity: 'Epic',
        stats: { attack: 88, defense: 75, health: 120 },
        backstory: 'A rogue pilot whose ship is rumored to be powered by a miniature black hole, wanted in three systems.',
        imagePrompt: 'male cyberpunk pilot epic armor'
    },
    {
        mintAddress: 'CHAR2_bRtHjK...pL9a',
        name: 'Seraphina "Starlight" Valerius',
        level: 20,
        rarity: 'Legendary',
        stats: { attack: 95, defense: 90, health: 145 },
        backstory: 'A master strategist who can predict enemy movements with uncanny accuracy, once a high commander.',
        imagePrompt: 'female strategist legendary uniform'
    },
    {
        mintAddress: 'CHAR3_cTyUnM...wE4z',
        name: 'Kael "The Comet" Rook',
        level: 12,
        rarity: 'Rare',
        stats: { attack: 72, defense: 68, health: 105 },
        backstory: 'A genetically engineered super-soldier, loyal only to the highest bidder and his own code of honor.',
        imagePrompt: 'armored super soldier rare gear'
    },
    {
        mintAddress: 'CHAR4_dFgBoP...zX1v',
        name: 'Nyx "The Shadow" Ironhand',
        level: 8,
        rarity: 'Common',
        stats: { attack: 60, defense: 55, health: 95 },
        backstory: 'A scrappy mechanic who keeps the faction\'s ships flying with spit, grit, and stolen parts.',
        imagePrompt: 'female space mechanic common clothes'
    },
    {
        mintAddress: 'CHAR5_eHvCsQ...sT3b',
        name: 'Orion "Mercy" Kade',
        level: 15,
        rarity: 'Rare',
        stats: { attack: 80, defense: 60, health: 110 },
        backstory: 'A bounty hunter who never fails to bring back their target, known for completing "impossible" jobs.',
        imagePrompt: 'bounty hunter rare armor'
    },
    {
        mintAddress: 'CHAR6_fJkWbZ...uN7k',
        name: 'Lyra "The Ghost" Chen',
        level: 19,
        rarity: 'Epic',
        stats: { attack: 85, defense: 92, health: 130 },
        backstory: 'A disgraced royal guard seeking to restore their honor on the battlefield, an expert in stealth ops.',
        imagePrompt: 'royal guard epic stealth suit'
    },
    {
        mintAddress: 'CHAR7_gLpXvA...vM5h',
        name: 'Valerius "Ronin" Specter',
        level: 16,
        rarity: 'Rare',
        stats: { attack: 82, defense: 70, health: 115 },
        backstory: 'A cybernetic ronin wandering the galaxy in search of a worthy opponent and a lost memory.',
        imagePrompt: 'cybernetic ronin rare cloak'
    },
     {
        mintAddress: 'CHAR8_hMqYwB...wP9j',
        name: 'Rook "The Engineer" Flint',
        level: 5,
        rarity: 'Common',
        stats: { attack: 52, defense: 65, health: 100 },
        backstory: 'An inventive engineer who can turn a pile of scrap into a functional weapon system overnight.',
        imagePrompt: 'space engineer common workshop'
    }
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
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="w-full mt-4" variant="secondary" disabled>
                                <Gem className="mr-2" size={16} /> Upgrade
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Character upgrades coming soon!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}

export default function CharacterPanel() {
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        // In the future, this will fetch characters from the Honeycomb Protocol
        setCharacters(sampleCharacters);
    }, []);

    return (
        <Card className="h-full bg-transparent border-0 shadow-none">
            <CardContent className="p-0 h-full flex flex-col">
                 <div className="p-4 pl-0 pb-2 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Your available crew. Fetched from blockchain.</p>
                </div>
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4 pb-4">
                        {characters.map((char) => <CharacterCard key={char.mintAddress} char={char} />)}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

    
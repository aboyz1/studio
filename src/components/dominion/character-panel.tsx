'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Gem, Swords, Shield, Heart, Quote, RefreshCw } from 'lucide-react';

type Character = {
    id: string;
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

const firstNames = ['Jax', 'Seraphina', 'Valerius', 'Kael', 'Nyx', 'Rook', 'Orion', 'Lyra'];
const epithets = ['The Void', 'The Star-Smasher', 'The Comet', 'The Swift', 'The Shadow', 'The Engineer', 'The Merciless', 'The Ghost'];
const backstorySnippets = [
    'A rogue pilot whose ship is rumored to be powered by a miniature black hole.',
    'A master strategist who can predict enemy movements with uncanny accuracy.',
    'A genetically engineered super-soldier, loyal only to the highest bidder.',
    'A scrappy mechanic who keeps the faction\'s ships flying with spit and grit.',
    'A bounty hunter who never fails to bring back their target, dead or alive.',
    'A disgraced royal guard seeking to restore their honor on the battlefield.',
    'A cybernetic ronin wandering the galaxy in search of a worthy opponent.'
];
const imagePrompts = ['cyberpunk pilot', 'female strategist', 'armored super soldier', 'space mechanic', 'bounty hunter', 'royal guard', 'cybernetic ronin'];

const rarityColor: Record<string, string> = {
    Common: 'border-gray-400',
    Rare: 'border-blue-500',
    Epic: 'border-purple-500',
    Legendary: 'border-yellow-500',
};

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const generateCharacter = (): Character => {
    const attack = 50 + Math.floor(Math.random() * 50);
    const defense = 50 + Math.floor(Math.random() * 50);
    const health = 90 + Math.floor(Math.random() * 60);
    const totalStats = attack + defense + health;
    const backstoryIndex = Math.floor(Math.random() * backstorySnippets.length);

    let rarity: Character['rarity'] = 'Common';
    if (totalStats > 280) rarity = 'Legendary';
    else if (totalStats > 240) rarity = 'Epic';
    else if (totalStats > 200) rarity = 'Rare';

    return {
        id: crypto.randomUUID(),
        name: `${getRandom(firstNames)} "${getRandom(epithets)}"`,
        level: Math.floor(1 + Math.random() * 19),
        rarity,
        stats: { attack, defense, health },
        backstory: backstorySnippets[backstoryIndex],
        imagePrompt: `${imagePrompts[backstoryIndex]} ${rarity.toLowerCase()}`,
    };
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
    const [characters, setCharacters] = useState<Character[]>([]);

    const regenerateCharacters = () => {
        setCharacters(Array.from({ length: 8 }, generateCharacter));
    }

    useEffect(() => {
        regenerateCharacters();
    }, []);

    return (
        <Card className="h-full bg-transparent border-0 shadow-none">
            <CardContent className="p-0 h-full flex flex-col">
                 <div className="p-4 pl-0 pb-2 flex justify-end">
                    <Button onClick={regenerateCharacters} variant="outline">
                        <RefreshCw size={16} className="mr-2" />
                        Regenerate
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-27rem)] md:h-[calc(100vh-31rem)] lg:h-[calc(100vh-29rem)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
                        {characters.map((char) => <CharacterCard key={char.id} char={char} />)}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

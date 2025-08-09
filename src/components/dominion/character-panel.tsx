'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Gem, Swords, Shield, Heart, Quote, RefreshCw } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { generateCharacters, type Character } from '@/ai/flows/character-generation';
import { Skeleton } from '../ui/skeleton';

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

function CharacterSkeleton() {
    return (
        <Card className="bg-card/70 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-3 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
        </Card>
    );
}

export default function CharacterPanel() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchCharacters = () => {
        startTransition(async () => {
            const { characters } = await generateCharacters();
            setCharacters(characters);
        });
    }

    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <Card className="h-full bg-transparent border-0 shadow-none">
            <CardContent className="p-0 h-full flex flex-col">
                <div className="px-4 pb-2 -mr-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={fetchCharacters} disabled={isPending}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                        {isPending ? 'Generating...' : 'Regenerate'}
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-25rem)] md:h-[calc(100vh-29rem)] lg:h-[calc(100vh-27rem)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
                        {isPending && characters.length === 0 ? (
                            Array.from({ length: 4 }).map((_, i) => <CharacterSkeleton key={i} />)
                        ) : (
                            characters.map((char) => <CharacterCard key={char.name} char={char} />)
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

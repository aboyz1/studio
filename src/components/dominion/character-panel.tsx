
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Gem, Swords, Shield, Heart, Quote, RefreshCcw, Loader2 } from 'lucide-react';
import { generateCharacters, Character } from '@/lib/character-generator';
import { useToast } from '@/hooks/use-toast';

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
                    <p className="text-xs italic flex gap-2 text-muted-foreground"><Quote size={12} className="flex-shrink-0" /> {char.backstory}</p>
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
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const handleGenerateCharacters = () => {
        setIsLoading(true);
        try {
            // This is now an instant, client-side operation
            const newCharacters = generateCharacters({count: 8});
            setCharacters(newCharacters);
        } catch(e) {
            console.error(e);
            toast({
                variant: 'destructive',
                title: 'Character Generation Failed',
                description:
                'There was an error generating new characters. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        handleGenerateCharacters();
    }, []);

    return (
        <Card className="h-full bg-transparent border-0 shadow-none">
            <CardContent className="p-0 h-full flex flex-col">
                 <div className="p-4 pl-0 pb-2 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Your available crew. Assembled locally.</p>
                     <Button variant="outline" size="sm" onClick={handleGenerateCharacters} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                        Assemble New Crew
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4 pb-4">
                        {isLoading && characters.length === 0 ? (
                           Array.from({ length: 8 }).map((_, index) => (
                                <Card key={index} className="bg-card/70 backdrop-blur-sm">
                                    <CardHeader className="p-4 flex flex-row items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                            <div className="h-10 w-full bg-muted animate-pulse rounded mt-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                           ))
                        ) : (
                            characters.map((char) => <CharacterCard key={char.mintAddress} char={char} />)
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

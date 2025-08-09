'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Users, Atom, Shield, MapPin, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const FACTION_COLORS = {
    'The Cygnus Syndicate': 'text-sky-400',
    'Orion Arm Collective': 'text-amber-400',
    'Unclaimed': 'text-gray-400',
};

export default function TerritoryInfoPanel({ territory, onClose }) {
    const factionColor = territory ? FACTION_COLORS[territory.faction.name] : '';

    return (
        <div className={cn(
            "absolute top-0 right-0 h-full w-full md:w-80 lg:w-96 p-4 transition-transform duration-500 ease-in-out",
            territory ? "translate-x-0" : "translate-x-full",
            "pointer-events-none"
        )}>
            <Card className={cn(
                "h-full bg-card/80 backdrop-blur-lg border-l-4 pointer-events-auto",
                territory?.faction.name === 'The Cygnus Syndicate' && 'border-sky-400',
                territory?.faction.name === 'Orion Arm Collective' && 'border-amber-400',
                territory?.faction.name === 'Unclaimed' && 'border-gray-400',
            )}>
                {territory && (
                    <>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={onClose}>
                            <X size={20} />
                        </Button>
                        <CardHeader className="pr-10">
                            <CardTitle className="font-headline text-lg">Sector {territory.q}, {territory.r}</CardTitle>
                            <CardDescription className={cn("font-semibold", factionColor)}>
                                {territory.faction.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-muted-foreground"><Users size={16} /> Population</span>
                                    <span className="font-mono">{territory.population}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-muted-foreground"><Atom size={16} /> Dominant Resource</span>
                                    <span className="font-mono">{territory.resource}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-muted-foreground"><Shield size={16} /> Defense Grid</span>
                                    <span className="font-mono">{territory.defense}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3 pt-2">
                               <Button className="w-full font-headline">
                                   <MapPin size={16} className="mr-2"/> View Fleets
                               </Button>
                               <Button variant="secondary" className="w-full font-headline">
                                    <BarChart3 size={16} className="mr-2"/> Economic Report
                               </Button>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}

'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Wallet, Rocket, Users, BarChart, UserSquare, Globe } from 'lucide-react';

const helpTopics = [
    {
        icon: Wallet,
        title: '1. Connect Your Wallet',
        content: 'The first step is to connect your Solana wallet. Click the "Connect Wallet" button in the top-right corner. This is your identity in the Dominion 3D universe and how you\'ll manage your assets.',
    },
    {
        icon: UserSquare,
        title: '2. Manage Your Characters',
        content: 'The "Characters" tab is your barracks. Here you can view your crew, see their stats, and upgrade them. The characters are currently generated for demonstration. Click "Regenerate" to see a new set!',
    },
    {
        icon: Rocket,
        title: '3. Undertake Missions',
        content: 'The Missions Dashboard on the left shows available jobs. You can dispatch characters to earn rewards like credits, faction tokens, and rare items. Pay attention to mission status and claim your rewards upon completion.',
    },
    {
        icon: Users,
        title: '4. Align with a Faction',
        content: 'The Factions panel shows the major powers in the galaxy. Aligning with a faction is a key strategic decision that will influence your gameplay and open up unique opportunities.',
    },
    {
        icon: BarChart,
        title: '5. Track Your Progress',
        content: 'The Player Analytics panel gives you a snapshot of your performance, including your win/loss ratio and loyalty tier. Improving these stats will grant you better rewards.',
    },
    {
        icon: Globe,
        title: 'What\'s Next?',
        content: 'Soon, the 3D view will become an interactive map of the galaxy. You\'ll be able to command your forces, conquer territories, and engage in tactical battles directly on the map.',
    }
]

export default function HelpPanel() {
    return (
        <Card className="h-full bg-transparent border-0 shadow-none">
            <CardContent className="p-4 h-full">
                <Card className="bg-card/70 backdrop-blur-sm h-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-primary">Getting Started</CardTitle>
                        <CardDescription>Welcome to Dominion 3D. Here’s your guide to conquering the galaxy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue="item-0">
                            {helpTopics.map((topic, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="font-headline text-md">
                                        <div className="flex items-center gap-3">
                                            <topic.icon className="h-5 w-5 text-accent" />
                                            {topic.title}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pl-10">
                                        {topic.content}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rocket, Target, Gem, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const missions = [
  {
    id: 1,
    title: 'Recon Sector 7-G',
    description: 'Scout the asteroid belt for enemy presence.',
    progress: 75,
    reward: '500 Credits',
    time: '2h 15m remaining',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Supply Raid on Xylos',
    description: 'Intercept a rival faction\'s supply convoy.',
    progress: 0,
    reward: '2 Faction Tokens',
    time: '4h duration',
    status: 'Available',
  },
  {
    id: 3,
    title: 'Defend Cygnus Outpost',
    description: 'Repel the incoming attack on our territory.',
    progress: 100,
    reward: '1 Rare Crate',
    time: 'Completed',
    status: 'Completed',
  },
  {
    id: 4,
    title: 'Data Heist',
    description: 'Infiltrate a corporate data-haven and extract intel.',
    progress: 0,
    reward: '1 Epic DNA Key',
    time: '8h duration',
    status: 'Available',
  },
];

export default function MissionsPanel() {
  const { toast } = useToast();

  const handleMissionAction = (status: string, title: string) => {
    if (status === 'Available') {
      toast({
        title: "Starting Mission",
        description: `Your squad has been dispatched for "${title}".`,
      })
    } else if (status === 'Completed') {
      toast({
        title: "Claiming Rewards",
        description: `Rewards for "${title}" have been added to your inventory.`,
      })
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Target size={24} className="text-primary" /> Missions Dashboard</CardTitle>
        <CardDescription>Deploy your characters and earn rewards.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-6 pt-0">
            {missions.map((mission) => (
              <div key={mission.id} className="p-4 rounded-lg bg-card/50 space-y-3">
                <h3 className="font-headline text-md">{mission.title}</h3>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
                
                {mission.status === 'In Progress' && <Progress value={mission.progress} className="h-2" />}
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Gem size={12} className="text-accent" /> {mission.reward}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {mission.time}</span>
                </div>

                <Button 
                  className="w-full"
                  variant={mission.status === 'Available' ? 'default' : mission.status === 'Completed' ? 'secondary' : 'outline'}
                  disabled={mission.status === 'In Progress'}
                  onClick={() => handleMissionAction(mission.status, mission.title)}
                >
                  {mission.status === 'Available' && <Rocket className="mr-2" size={16} />}
                  {mission.status}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

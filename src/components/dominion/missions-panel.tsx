'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rocket, Target, Gem, Clock, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type MissionStatus = 'Available' | 'In Progress' | 'Completed';

type Mission = {
  id: number;
  title: string;
  description: string;
  progress: number;
  reward: string;
  duration: number; // in seconds
  timeLeft: number; // in seconds
  status: MissionStatus;
};

const initialMissions: Mission[] = [
  {
    id: 1,
    title: 'Recon Sector 7-G',
    description: 'Scout the asteroid belt for enemy presence.',
    progress: 0,
    reward: '500 Credits',
    duration: 120, // 2 minutes
    timeLeft: 120,
    status: 'Available',
  },
  {
    id: 2,
    title: 'Supply Raid on Xylos',
    description: 'Intercept a rival faction\'s supply convoy.',
    progress: 0,
    reward: '2 Faction Tokens',
    duration: 240, // 4 minutes
    timeLeft: 240,
    status: 'Available',
  },
  {
    id: 3,
    title: 'Defend Cygnus Outpost',
    description: 'Repel the incoming attack on our territory.',
    progress: 0,
    reward: '1 Rare Crate',
    duration: 60, // 1 minute
    timeLeft: 60,
    status: 'Available',
  },
  {
    id: 4,
    title: 'Data Heist',
    description: 'Infiltrate a corporate data-haven and extract intel.',
    progress: 0,
    reward: '1 Epic DNA Key',
    duration: 300, // 5 minutes
    timeLeft: 300,
    status: 'Available',
  },
];

const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', s > 0 ? `${s}s` : '']
        .filter(Boolean)
        .join(' ');
};

export default function MissionsPanel() {
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>(initialMissions);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissions(prevMissions => 
        prevMissions.map(mission => {
          if (mission.status === 'In Progress' && mission.timeLeft > 0) {
            const newTimeLeft = mission.timeLeft - 1;
            const newProgress = Math.min(100, ((mission.duration - newTimeLeft) / mission.duration) * 100);
            if (newTimeLeft <= 0) {
              return { ...mission, timeLeft: 0, progress: 100, status: 'Completed' };
            }
            return { ...mission, timeLeft: newTimeLeft, progress: newProgress };
          }
          return mission;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMissionAction = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    if (mission.status === 'Available') {
      setMissions(prevMissions =>
        prevMissions.map(m =>
          m.id === missionId ? { ...m, status: 'In Progress' } : m
        )
      );
      toast({
        title: "Starting Mission",
        description: `Your squad has been dispatched for "${mission.title}".`,
      });
    } else if (mission.status === 'Completed') {
      setMissions(prevMissions =>
        prevMissions.map(m =>
          m.id === missionId 
            ? { ...m, status: 'Available', progress: 0, timeLeft: m.duration } 
            : m
        )
      );
      toast({
        title: "Claiming Rewards",
        description: `Rewards for "${mission.title}" have been added to your inventory.`,
      });
    }
  };

  const getMissionTimeText = (mission: Mission) => {
      switch(mission.status) {
          case 'Available': return `${formatTime(mission.duration)} duration`;
          case 'In Progress': return `${formatTime(mission.timeLeft)} remaining`;
          case 'Completed': return 'Completed';
          default: return '';
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
                    <span className="flex items-center gap-1"><Clock size={12} /> {getMissionTimeText(mission)}</span>
                </div>

                <Button 
                  className="w-full"
                  variant={mission.status === 'Available' ? 'default' : mission.status === 'Completed' ? 'secondary' : 'outline'}
                  disabled={mission.status === 'In Progress'}
                  onClick={() => handleMissionAction(mission.id)}
                >
                  {mission.status === 'Available' && <Rocket className="mr-2" size={16} />}
                  {mission.status === 'Completed' && <CheckCircle className="mr-2" size={16} />}
                  {mission.status === 'Completed' ? 'Claim Reward' : mission.status}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

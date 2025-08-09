'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Crown, Zap, BarChart, Medal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const ranks = [
  "Ensign",
  "Lieutenant",
  "Commander",
  "Captain",
  "Commodore",
  "Admiral",
];

const currentRankIndex = 2; // Example: Commander
const progressToNextRank = 65; // Example: 65%

export default function PlayerStats() {
  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-primary">Player Analytics</CardTitle>
        <CardDescription>Your performance, loyalty, and rank.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BarChart className="text-accent" size={20} />
            <div>
              <div className="text-muted-foreground">Win/Loss</div>
              <div className="font-bold">2.34</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-accent" size={20} />
            <div>
              <div className="text-muted-foreground">Missions</div>
              <div className="font-bold">42</div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2"><Crown size={16} className="text-yellow-400" /> Loyalty Tier</h4>
            <div className="flex justify-between items-center text-sm">
                <span>Gold Tier</span>
                <span className="font-mono text-accent">2.5x Rewards</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap size={14} className="text-yellow-400" />
                <span>Engagement Streak: 14 days</span>
            </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Medal size={16} className="text-orange-400" /> Faction Rank
          </h4>
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold">{ranks[currentRankIndex]}</span>
            <span className="text-muted-foreground">
              Next: {ranks[currentRankIndex + 1]}
            </span>
          </div>
          <Progress value={progressToNextRank} className="h-2" />
           <p className="text-xs text-muted-foreground pt-1">
            Reach the highest rank to challenge for faction leadership or establish your own dominion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

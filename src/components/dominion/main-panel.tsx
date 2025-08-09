import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CharacterPanel from './character-panel';
import { Users, Gem, Settings } from 'lucide-react';

export default function MainPanel() {
  return (
    <Tabs defaultValue="characters" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3 bg-card/70 backdrop-blur-sm">
        <TabsTrigger value="characters" className="font-headline"><Users className="mr-2 h-4 w-4" />Characters</TabsTrigger>
        <TabsTrigger value="marketplace" className="font-headline"><Gem className="mr-2 h-4 w-4" />Marketplace</TabsTrigger>
        <TabsTrigger value="settings" className="font-headline"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="characters" className="flex-1 -mt-1">
        <CharacterPanel />
      </TabsContent>
      <TabsContent value="marketplace" className="flex-1 -mt-1">
        <div className="flex items-center justify-center h-full text-muted-foreground">Marketplace Coming Soon</div>
      </TabsContent>
      <TabsContent value="settings" className="flex-1 -mt-1">
        <div className="flex items-center justify-center h-full text-muted-foreground">Settings Coming Soon</div>
      </TabsContent>
    </Tabs>
  );
}

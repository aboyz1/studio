
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Character {
  mintAddress: string;
  name: string;
  level: number;
  rarity: Rarity;
  stats: {
    attack: number;
    defense: number;
    health: number;
  };
  backstory: string;
  imagePrompt: string;
}

interface GenerateCharacterInput {
    count: number;
}

// --- Data Banks ---
const firstNames = ['Jax', 'Kira', 'Zane', 'Lyra', 'Orion', 'Vesper', 'Rook', 'Seraphina', 'Corvus', 'Aria'];
const lastNames = ['Volkov', 'Stryker', 'Korvac', 'Vex', 'Syndicate', 'Prime', 'Odyssey', 'Blackwood', 'Cypher', 'Helios'];
const roles = ['Pilot', 'Strategist', 'Soldier', 'Mechanic', 'Bounty Hunter', 'Spy', 'Medic', 'Engineer', 'Navigator', 'Smuggler'];
const backstories = [
    'A disgraced war hero seeking redemption on the galactic frontier.',
    'The sole survivor of a deep-space exploration mission gone wrong.',
    'A cybernetically-enhanced assassin trying to escape their shadowy past.',
    'A brilliant engineer who deserted a corporate mega-conglomerate with stolen blueprints.',
    'A master smuggler who knows every hidden hyperspace lane in the sector.',
    'A battle-hardened medic who has seen the horrors of a dozen wars.',
    'A genetically-engineered soldier created for a war that ended before they were deployed.',
    'A charming rogue with a heart of gold and a knack for getting into trouble.'
];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const rarityDistribution = {
    Common: 0.5,
    Rare: 0.3,
    Epic: 0.15,
    Legendary: 0.05,
};

const getRarity = (): Rarity => {
    const rand = Math.random();
    let cumulative = 0;
    for (const [rarity, chance] of Object.entries(rarityDistribution)) {
        cumulative += chance;
        if (rand < cumulative) {
            return rarity as Rarity;
        }
    }
    return 'Common';
};

const statRanges = {
    Common: { level: [1, 10], attack: [50, 65], defense: [50, 65], health: [90, 100] },
    Rare: { level: [10, 15], attack: [65, 80], defense: [65, 80], health: [100, 115] },
    Epic: { level: [15, 20], attack: [80, 90], defense: [80, 90], health: [115, 135] },
    Legendary: { level: [20, 30], attack: [90, 100], defense: [90, 100], health: [135, 150] },
};

export function generateCharacters(input: GenerateCharacterInput): Character[] {
    const characters: Character[] = [];
    for (let i = 0; i < input.count; i++) {
        const rarity = getRarity();
        const statRange = statRanges[rarity];
        const role = getRandom(roles);
        const name = `${getRandom(firstNames)} ${getRandom(lastNames)}`;

        const character: Character = {
            mintAddress: `CHAR_${Date.now()}_${i}`,
            name,
            rarity,
            level: getRandomInt(statRange.level[0], statRange.level[1]),
            stats: {
                attack: getRandomInt(statRange.attack[0], statRange.attack[1]),
                defense: getRandomInt(statRange.defense[0], statRange.defense[1]),
                health: getRandomInt(statRange.health[0], statRange.health[1]),
            },
            backstory: getRandom(backstories),
            imagePrompt: `portrait of a sci-fi ${role}, ${name}, ${rarity} rarity, detailed tactical gear, serious expression`,
        };
        characters.push(character);
    }
    return characters;
}

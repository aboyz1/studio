'use server';
/**
 * @fileOverview A character generation AI agent.
 *
 * - generateCharacters - A function that handles the character generation process.
 * - Character - The type for a single character.
 * - GenerateCharactersOutput - The return type for the generateCharacters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CharacterSchema = z.object({
    name: z.string().describe('The name of the character.'),
    level: z.number().describe('The level of the character, between 1 and 20.'),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']).describe('The rarity of the character.'),
    stats: z.object({
        attack: z.number().describe('The attack stat, between 20 and 100.'),
        defense: z.number().describe('The defense stat, between 20 and 100.'),
        health: z.number().describe('The health stat, between 50 and 150.'),
    }),
    backstory: z.string().describe('A short, compelling backstory for the character (1-2 sentences).'),
    imagePrompt: z.string().describe('A concise DALL-E prompt to generate an avatar for this character, e.g., "cyberpunk warrior" or "stealthy astronaut".'),
});

export type Character = z.infer<typeof CharacterSchema>;

const GenerateCharactersOutputSchema = z.object({
  characters: z.array(CharacterSchema),
});

export type GenerateCharactersOutput = z.infer<typeof GenerateCharactersOutputSchema>;


export async function generateCharacters(): Promise<GenerateCharactersOutput> {
  return generateCharactersFlow();
}

const prompt = ai.definePrompt({
  name: 'generateCharactersPrompt',
  output: {schema: GenerateCharactersOutputSchema},
  prompt: `You are a game designer for a sci-fi strategy game called Dominion 3D.

  Generate 4 unique characters for the game. Ensure a mix of rarities.
  
  Characters should have names, levels, rarities, stats (attack, defense, health), a short backstory, and a simple image prompt for an AI image generator.`,
});

const generateCharactersFlow = ai.defineFlow(
  {
    name: 'generateCharactersFlow',
    outputSchema: GenerateCharactersOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);

'use server';
/**
 * @fileOverview A character generation AI agent for a sci-fi game.
 *
 * - generateCharacters - A function that handles character generation.
 * - GenerateCharacterInput - The input type for the generateCharacters function.
 * - Character - The type for a single generated character.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';
import {v4 as uuidv4} from 'uuid';

export const CharacterSchema = z.object({
    mintAddress: z.string().describe('A unique identifier for the character, like a blockchain mint address.'),
    name: z.string().describe("The character's full name."),
    level: z.number().describe("The character's starting level."),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary']).describe("The character's rarity."),
    stats: z.object({
        attack: z.number().describe('The attack power of the character.'),
        defense: z.number().describe('The defense value of the character.'),
        health: z.number().describe('The health points of the character.'),
    }),
    backstory: z.string().describe("A short, compelling backstory for the character (2-3 sentences)."),
    imagePrompt: z.string().describe('A detailed prompt for an image generation model to create a portrait. Should include gender, key features, armor/clothing style, and overall mood. Example: "male cyberpunk pilot with cybernetic eye, epic tactical armor, serious expression"'),
});
export type Character = z.infer<typeof CharacterSchema>;

const GenerateCharacterInputSchema = z.object({
  count: z.number().default(1).describe('The number of characters to generate.'),
});
export type GenerateCharacterInput = z.infer<typeof GenerateCharacterInputSchema>;

const GenerateCharacterOutputSchema = z.array(CharacterSchema);


export async function generateCharacters(input: GenerateCharacterInput): Promise<Character[]> {
  return generateCharacterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterPrompt',
  input: {schema: GenerateCharacterInputSchema},
  output: {schema: GenerateCharacterOutputSchema},
  prompt: `
    You are a character creator for a sci-fi tactical game called "Dominion 3D".
    Your task is to generate a diverse set of {{count}} unique characters for the player's crew.

    Guidelines:
    1.  **Diversity:** Create a mix of genders, roles (e.g., pilot, strategist, soldier, mechanic, bounty hunter, spy), and personalities.
    2.  **Rarity Distribution:** Ensure a good mix of rarities. For a set of 8, aim for roughly 2 Common, 3 Rare, 2 Epic, and 1 Legendary. Adjust proportionally for other counts.
    3.  **Stat Balancing:** Stats should correlate with rarity and level.
        *   **Common (Lvl 1-10):** Attack/Defense: 50-65, Health: 90-100
        *   **Rare (Lvl 10-15):** Attack/Defense: 65-80, Health: 100-115
        *   **Epic (Lvl 15-20):** Attack/Defense: 80-90, Health: 115-135
        *   **Legendary (Lvl 20+):** Attack/Defense: 90-100, Health: 135-150
    4.  **Backstories:** Keep backstories concise but evocative, hinting at a larger history.
    5.  **Image Prompts:** Be descriptive and specific. The prompts should capture the essence of the character for an AI image generator.

    Generate the requested number of characters and return them as a JSON array.
  `,
});


const generateCharacterFlow = ai.defineFlow(
  {
    name: 'generateCharacterFlow',
    inputSchema: GenerateCharacterInputSchema,
    outputSchema: GenerateCharacterOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const characters = llmResponse.output!;

    // Add unique mint addresses to each character
    return characters.map(character => ({
        ...character,
        mintAddress: `CHAR_${uuidv4()}`
    }));
  }
);

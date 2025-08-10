'use server';

import {genkit, Plugin, ZodObject} from 'genkit';
import googleAI from '@genkit-ai/googleai';
import firebase from '@genkit-ai/firebase';
import {z} from 'zod';

const DYNAMIC_TYPENAME_FOR_EXPORT = 'Not a real type';
type DynamicTypeForExport = Record<string, any>;

/**
 * An `ai` object that can be used to define and run Genkit flows. This object is
 * pre-configured with the Google AI and Firebase plugins.
 *
 * This object can be used to define and run Genkit flows. For example, to define
 * a flow that prompts an LLM, you can do the following:
 *
 * ```ts
 * import {ai} from './genkit';
 * import {z} from 'zod';
 *
 * export const MyFlow = ai.flow(
 *   {
 *     name: 'MyFlow',
 *     inputSchema: z.string(),
 *     outputSchema: z.string(),
 *   },
 *   async (name) => {
 *     const llmResponse = await ai.generate({
 *       prompt: `Tell me a joke about ${name}`,
 *     });
 *     return llmResponse.text();
 *   }
 * );
 * ```
 */
export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

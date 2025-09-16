
'use server';
/**
 * @fileOverview An AI flow for generating hardware change suggestions.
 *
 * - getHardwareSuggestion - A function that generates a hardware change plan.
 * - HardwareSuggestionInput - The input type for the getHardwareSuggestion function.
 * - HardwareSuggestionOutput - The return type for the getHardwareSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { HardwareChangeSuggestion, ServerHardwareConfig } from '@/lib/types';

const HardwareConfigSchema = z.object({
    cpu: z.string().describe('CPU model and core count'),
    memory: z.string().describe('Memory size and type'),
    storage: z.string().describe('Storage configuration (HDD/SSD/NVMe)'),
    gpu: z.string().optional().describe('GPU model and count'),
    vpcNetwork: z.string().optional().describe('VPC network card configuration'),
    computeNetwork: z.string().optional().describe('Compute network (e.g., NVLINK)'),
    storageNetwork: z.string().optional().describe('Storage network configuration'),
    nic: z.string().optional().describe('Network Interface Card for CPU servers'),
});

const HardwareSuggestionInputSchema = z.object({
  serverType: z.enum(['CPU', 'GPU']).describe('The type of the server.'),
  currentConfig: HardwareConfigSchema.describe('The current hardware configuration of the server.'),
  targetConfig: HardwareConfigSchema.describe('The desired target hardware configuration.'),
});
export type HardwareSuggestionInput = z.infer<typeof HardwareSuggestionInputSchema>;


const SuggestionActionSchema = z.enum(['add', 'remove', 'replace', 'none']);

const HardwareSuggestionOutputSchema = z.object({
  cpu: z.object({
    action: SuggestionActionSchema,
    details: z.string().describe("Details of the CPU change, e.g., 'Replace 2x 4314 with 2x 5318Y' or 'Add 16GB RAM'. Be specific.")
  }),
  memory: z.object({
    action: SuggestionActionSchema,
    details: z.string().describe("Details of the memory change. Be specific.")
  }),
  storage: z.object({
    action: SuggestionActionSchema,
    details: z.string().describe("Details of the storage change. Be specific.")
  }),
  gpu: z.object({
    action: SuggestionActionSchema,
    details: z.string().describe("Details of the GPU change. Be specific.")
  }).optional(),
  nic: z.object({
    action: SuggestionActionSchema,
    details: z.string().describe("Details of the NIC change. Be specific.")
  }).optional(),
  network: z.object({
    action: SuggestionActionSchema,
    details: z.string().describe("Details of any other network hardware changes (VPC, Compute, Storage). Be specific.")
  }).optional(),
});

export type HardwareSuggestionOutput = z.infer<typeof HardwareSuggestionOutputSchema>;

export async function getHardwareSuggestion(input: HardwareSuggestionInput): Promise<HardwareSuggestionOutput> {
  return hardwareSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hardwareSuggestionPrompt',
  input: { schema: HardwareSuggestionInputSchema },
  output: { schema: HardwareSuggestionOutputSchema },
  prompt: `You are an expert server hardware technician. Your task is to compare a server's current hardware configuration with a target configuration and generate a clear, concise hardware change plan.

Server Type: {{{serverType}}}

Current Configuration:
- CPU: {{{currentConfig.cpu}}}
- Memory: {{{currentConfig.memory}}}
- Storage: {{{currentConfig.storage}}}
{{#if currentConfig.gpu}}- GPU: {{{currentConfig.gpu}}}{{/if}}
{{#if currentConfig.nic}}- NIC: {{{currentConfig.nic}}}{{/if}}
{{#if currentConfig.vpcNetwork}}- VPC Network: {{{currentConfig.vpcNetwork}}}{{/if}}
{{#if currentConfig.computeNetwork}}- Compute Network: {{{currentConfig.computeNetwork}}}{{/if}}
{{#if currentConfig.storageNetwork}}- Storage Network: {{{currentConfig.storageNetwork}}}{{/if}}

Target Configuration:
- CPU: {{{targetConfig.cpu}}}
- Memory: {{{targetConfig.memory}}}
- Storage: {{{targetConfig.storage}}}
{{#if targetConfig.gpu}}- GPU: {{{targetConfig.gpu}}}{{/if}}
{{#if targetConfig.nic}}- NIC: {{{targetConfig.nic}}}{{/if}}
{{#if targetConfig.vpcNetwork}}- VPC Network: {{{targetConfig.vpcNetwork}}}{{/if}}
{{#if targetConfig.computeNetwork}}- Compute Network: {{{targetConfig.computeNetwork}}}{{/if}}
{{#if targetConfig.storageNetwork}}- Storage Network: {{{targetConfig.storageNetwork}}}{{/if}}

Please analyze the differences and determine the action (add, remove, replace, or none) and specific details for each component.
- For "replace", the details should be like "Replace X with Y".
- For "add", details should be "Add Y".
- For "remove", details should be "Remove X".
- For "none", details should be "No change needed".
- Be specific about quantities and models. For example, instead of "Add RAM", say "Add 2x 32GB DDR4-3200".
- If a component exists in the target but not the current, the action is 'add'.
- If a component exists in the current but not the target, the action is 'remove'.
- If a component is different between current and target, the action is 'replace'.
- If they are the same, the action is 'none'.
- Group all network-related changes (VPC, Compute, Storage) under the 'network' field if it's a GPU server.
`,
});

const hardwareSuggestionFlow = ai.defineFlow(
  {
    name: 'hardwareSuggestionFlow',
    inputSchema: HardwareSuggestionInputSchema,
    outputSchema: HardwareSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

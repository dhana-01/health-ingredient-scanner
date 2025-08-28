import { z } from "https://deno.land/x/zod/mod.ts";

// Define the structure for individual ingredient analysis
const IngredientAnalysisSchema = z.object({
  ingredient: z.string(),
  reason: z.string(),
});

// Define the main analysis schema
export const AnalysisSchema = z.object({
  beneficial: z.array(IngredientAnalysisSchema),
  harmful: z.array(IngredientAnalysisSchema),
  neutral: z.array(IngredientAnalysisSchema),
  summary: z.string(),
});

// Export the type for use in other functions
export type Analysis = z.infer<typeof AnalysisSchema>;

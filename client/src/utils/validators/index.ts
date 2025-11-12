import { z } from "zod";

export const ChatInputValidation = z.object({
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters long")
    .max(100, "Company name must be at most 100 characters long"),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters long")
    .max(100, "Category must be at most 100 characters long"),
});

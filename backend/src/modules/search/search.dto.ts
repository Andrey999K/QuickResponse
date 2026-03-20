import { z } from "zod";

export const createSearchDto = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  keywords: z.string().max(500, "Keywords is too long").optional().nullable(),
  excluded_text: z.string().max(500, "Excluded text is too long").optional().nullable(),
  salary: z.number().int().positive("Salary must be positive").optional().nullable(),
  currency: z.enum(["RUR", "USD", "EUR", "KZT", "BYR", "UAH", "AZN", "GEL", "KGS", "UZS"]).default("RUR"),
  only_with_salary: z.boolean().default(false),
  area: z.array(z.number()).default([]),
  schedule: z.array(z.enum(["fullDay", "shift", "flexible", "remote", "flyInFlyOut"])).default([]),
  employment: z.array(z.enum(["FULL", "PART", "PROJECT", "FLY_IN_FLY_OUT", "SIDE_JOB"])).default([]),
  experience: z.array(z.enum(["noExperience", "between1And3", "between3And6", "moreThan6"])).default([]),
  cover_letter: z.string().max(1000, "Cover letter is too long").optional().nullable(),
});

export const updateSearchDto = createSearchDto.partial();

export const searchQueryDto = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
});

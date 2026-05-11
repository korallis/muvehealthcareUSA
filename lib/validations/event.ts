// lib/validations/event.ts
import { z } from "zod";

export const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().datetime({ message: "Invalid ISO date string" }), // Matches Postman format
  endDate: z.string().datetime().optional(),
  featuredImg: z.string().url("Must be a valid URL").optional(),
  seoTitle: z.string().max(60).optional(),
  seoDesc: z.string().max(160).optional(),
});

// For your PATCH routes
export const UpdateEventSchema = EventSchema.partial();

// TypeScript types inferred from the schemas
export type EventInput = z.infer<typeof EventSchema>;

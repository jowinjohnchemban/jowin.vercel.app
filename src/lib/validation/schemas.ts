/**
 * Validation Schemas
 * Zod schemas for runtime type validation and TypeScript type inference
 * @module lib/validation/schemas
 */

import { z } from "zod";

/**
 * Contact form validation schema
 * Validates user input with comprehensive rules and error messages
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"), // allow any Unicode
  email: z
    .string()
    .email("Please enter a valid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must use only English letters and numbers"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"), // allow any Unicode, safe for all scripts
});

/**
 * Inferred TypeScript type from the contact form schema
 * Provides compile-time type safety for validated data
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

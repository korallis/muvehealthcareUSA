import { z } from "zod";

/* =============================================================
   Shared Helpers
   ============================================================= */

/** Email validation using refine for custom error messages */
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(320, "Email must be at most 320 characters")
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  });

/** URL validation allowing only http/https protocols */
export const safeUrlSchema = z
  .string()
  .min(1, "URL is required")
  .max(2048, "URL must be at most 2048 characters")
  .refine((val) => /^https?:\/\/.+/.test(val), {
    message: "URL must start with http:// or https://",
  });

/** Optional URL - allows empty string or valid http/https URL */
const optionalSafeUrlSchema = z
  .string()
  .max(2048, "URL must be at most 2048 characters")
  .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
    message: "URL must start with http:// or https://",
  })
  .optional()
  .or(z.literal(""));

/** UUID string validation */
const uuidSchema = z
  .string()
  .min(1, "ID is required")
  .refine(
    (val) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        val,
      ),
    { message: "Invalid UUID format" },
  );

/** Phone number - digits, spaces, dashes, parens, and optional leading + */
const phoneSchema = z
  .string()
  .min(7, "Phone number must be at least 7 characters")
  .max(20, "Phone number must be at most 20 characters")
  .refine((val) => /^[+]?[\d\s\-()]+$/.test(val), {
    message: "Invalid phone number",
  });

/* =============================================================
   FAQ Schemas
   ============================================================= */

export const createFAQSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must be at most 500 characters"),
  answer: z
    .string()
    .min(5, "Answer must be at least 5 characters")
    .max(5000, "Answer must be at most 5000 characters"),
  categoryId: uuidSchema,
});

export const updateFAQSchema = createFAQSchema;

/* =============================================================
   FAQ Category Schemas
   ============================================================= */

export const createFAQCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .refine((val) => val.trim().length >= 2, {
      message: "Name must not be empty or only whitespace",
    }),
});

/* =============================================================
   Quicklink Schemas
   ============================================================= */

export const createQuicklinkSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must be at most 500 characters"),
  answer: z
    .string()
    .min(5, "Answer must be at least 5 characters")
    .max(5000, "Answer must be at most 5000 characters"),
  categoryId: uuidSchema,
  downloadUrl: optionalSafeUrlSchema,
});

export const updateQuicklinkSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must be at most 500 characters")
    .optional(),
  answer: z
    .string()
    .min(5, "Answer must be at least 5 characters")
    .max(5000, "Answer must be at most 5000 characters")
    .optional(),
  categoryId: uuidSchema.optional(),
  downloadUrl: optionalSafeUrlSchema,
});

/* =============================================================
   Quicklink Category Schemas
   ============================================================= */

export const createQuicklinkCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .refine((val) => val.trim().length >= 2, {
      message: "Name must not be empty or only whitespace",
    }),
});

/* =============================================================
   News Schemas
   ============================================================= */

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be at most 50000 characters"),
  categoryId: uuidSchema,
  seoDesc: z
    .string()
    .max(300, "SEO description must be at most 300 characters")
    .optional(),
  excerpt: z
    .string()
    .max(500, "Excerpt must be at most 500 characters")
    .optional(),
  featuredImg: optionalSafeUrlSchema,
  galleryImages: z
    .array(
      z
        .string()
        .max(2048)
        .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
          message: "Gallery image URL must start with http:// or https://",
        }),
    )
    .max(50, "Maximum 50 gallery images allowed")
    .optional(),
});

/* =============================================================
   Event Schemas
   ============================================================= */

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  categoryId: uuidSchema.optional(),
  description: z
    .string()
    .max(50000, "Description must be at most 50000 characters")
    .optional(),
  location: z
    .string()
    .max(300, "Location must be at most 300 characters")
    .optional(),
  seoDesc: z
    .string()
    .max(300, "SEO description must be at most 300 characters")
    .optional(),
  excerpt: z
    .string()
    .max(500, "Excerpt must be at most 500 characters")
    .optional(),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  featuredImg: optionalSafeUrlSchema,
});

/* =============================================================
   Job Schemas
   ============================================================= */

export const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be at most 100 characters"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location must be at most 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(50000, "Description must be at most 50000 characters"),
  salaryRange: z
    .string()
    .max(100, "Salary range must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  featuredImg: optionalSafeUrlSchema,
  applyUrl: optionalSafeUrlSchema,
});

/* =============================================================
   Story Schemas
   ============================================================= */

export const createStorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  role: z
    .string()
    .max(100, "Role must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(10000, "Content must be at most 10000 characters"),
  imageUrl: optionalSafeUrlSchema,
});

/* =============================================================
   Contact Form Schema
   ============================================================= */

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  phone: phoneSchema,
  email: emailSchema,
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
});

/* =============================================================
   Feedback Form Schema
   ============================================================= */

export const feedbackFormSchema = z.object({
  feedbackType: z
    .string()
    .min(1, "Feedback type is required")
    .max(100, "Feedback type must be at most 100 characters"),
  userType: z
    .string()
    .min(1, "User type is required")
    .max(100, "User type must be at most 100 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be at most 50 characters"),
  email: emailSchema,
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
});

/* =============================================================
   Service Enquiry Form Schema
   ============================================================= */

export const serviceEnquirySchema = z.object({
  form_title: z
    .string()
    .max(200, "Form title must be at most 200 characters")
    .optional(),
  "Full Name*": z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  "Phone Number*": phoneSchema,
  "Email Address*": emailSchema,
});

/* =============================================================
   Puck Page Save Schema
   ============================================================= */

export const puckPageSaveSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be at most 200 characters")
    .refine((val) => /^[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(val), {
      message:
        "Slug must contain only lowercase letters, numbers, hyphens, and forward slashes",
    }),
  data: z.record(z.string(), z.unknown()),
});

/* =============================================================
   Type Exports
   ============================================================= */

export type CreateFAQInput = z.infer<typeof createFAQSchema>;
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>;
export type CreateFAQCategoryInput = z.infer<typeof createFAQCategorySchema>;
export type CreateQuicklinkInput = z.infer<typeof createQuicklinkSchema>;
export type UpdateQuicklinkInput = z.infer<typeof updateQuicklinkSchema>;
export type CreateQuicklinkCategoryInput = z.infer<
  typeof createQuicklinkCategorySchema
>;
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateStoryInput = z.infer<typeof createStorySchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type FeedbackFormInput = z.infer<typeof feedbackFormSchema>;
export type ServiceEnquiryInput = z.infer<typeof serviceEnquirySchema>;
export type PuckPageSaveInput = z.infer<typeof puckPageSaveSchema>;

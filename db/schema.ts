import {
  pgTable,
  text,
  timestamp,
  jsonb,
  pgEnum,
  uuid,
  varchar,
  serial,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* -----------------------------------------------------
   Enums
----------------------------------------------------- */

export const postStatusEnum = pgEnum("post_status", ["DRAFT", "PUBLISHED"]);

export const newsStatusEnum = pgEnum("news_status", ["DRAFT", "PUBLISHED"]);

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
]);

export const jobStatusEnum = pgEnum("job_status", ["Open", "Closed"]);

/* -----------------------------------------------------
   Users (assumed – referenced by your schema)
----------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("user").notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(), // A secure random string
  role: text("role").default("user"),
  expiresAt: timestamp("expires_at").notNull(),
  status: invitationStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 1. Independent Categories Table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // Rename here to update everything
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -----------------------------------------------------
   Events (Updated with categoryId)
----------------------------------------------------- */
export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),

    // Relationship: References the categories table
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),

    seoDesc: text("seo_desc"),
    excerpt: text("excerpt"),
    description: text("description"),
    location: text("location"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    featuredImg: text("featured_img"),
    applyUrl: text("apply_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    seoTitle: text("seo_title"),
  },
  (table) => [
    index("events_category_id_idx").on(table.categoryId),
    index("events_created_by_id_idx").on(table.createdById),
    uniqueIndex("events_slug_idx").on(table.slug),
  ],
);

/* -----------------------------------------------------
   News (Updated with categoryId)
----------------------------------------------------- */
export const newsArticles = pgTable(
  "news_articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),

    // Relationship: References the categories table
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),

    featuredImg: text("featured_img"),
    publishedAt: timestamp("published_at"),
    status: newsStatusEnum("status").default("DRAFT").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    seoTitle: text("seo_title"),
    seoDesc: text("seo_desc"),
  },
  (table) => [
    index("news_articles_category_id_idx").on(table.categoryId),
    index("news_articles_author_id_idx").on(table.authorId),
    uniqueIndex("news_articles_slug_idx").on(table.slug),
  ],
);

// NEW TABLE: Handles up to 50 images per article
export const newsImages = pgTable(
  "news_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    articleId: uuid("article_id")
      .references(() => newsArticles.id, { onDelete: "cascade" })
      .notNull(),
    url: text("url").notNull(),
    alt: text("alt"),
    order: integer("order").default(0), // To keep images in a specific sequence
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("news_images_article_id_idx").on(table.articleId)],
);

// 2. Define Relationships for easy querying
export const categoriesRelations = relations(categories, ({ many }) => ({
  events: many(events),
  news: many(newsArticles),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id],
  }),
}));

export const newsArticlesRelations = relations(
  newsArticles,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [newsArticles.categoryId],
      references: [categories.id],
    }),
    images: many(newsImages),
  }),
);

export const newsImagesRelations = relations(newsImages, ({ one }) => ({
  article: one(newsArticles, {
    fields: [newsImages.articleId],
    references: [newsArticles.id],
  }),
}));

/* -----------------------------------------------------
   Job Categories Table
----------------------------------------------------- */
export const jobCategories = pgTable("job_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -----------------------------------------------------
   Jobs Table (Updated)
----------------------------------------------------- */
export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    categoryId: uuid("category_id")
      .references(() => jobCategories.id, { onDelete: "restrict" })
      .notNull(),
    location: text("location").notNull(),
    type: text("type").default("Full-time"),
    description: text("description").notNull(),
    featuredImg: text("featured_img"),
    requirements: text("requirements"),
    salaryRange: text("salary_range"),
    status: jobStatusEnum("status").default("Open"),
    applyUrl: text("apply_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("jobs_category_id_idx").on(table.categoryId),
    uniqueIndex("jobs_slug_idx").on(table.slug),
  ],
);

/* -----------------------------------------------------
   Relations (CRITICAL FOR db.query)
----------------------------------------------------- */
export const jobsRelations = relations(jobs, ({ one }) => ({
  category: one(jobCategories, {
    fields: [jobs.categoryId],
    references: [jobCategories.id],
  }),
}));

export const jobCategoriesRelations = relations(jobCategories, ({ many }) => ({
  jobs: many(jobs),
}));

// --- FAQ CATEGORIES ---
export const faqCategories = pgTable("faq_categories", {
  id: uuid("id").primaryKey().defaultRandom(), // Generates random UUID
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const faqs = pgTable(
  "faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .references(() => faqCategories.id, { onDelete: "cascade" })
      .notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("faqs_category_id_idx").on(table.categoryId)],
);

// --- QUICKLINK CATEGORIES ---
export const quicklinkCategories = pgTable("quicklink_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quicklinks = pgTable(
  "quicklinks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .references(() => quicklinkCategories.id, { onDelete: "cascade" })
      .notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    downloadUrl: text("download_url"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("quicklinks_category_id_idx").on(table.categoryId)],
);

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Omar"
  role: text("role").default("Impact Story"), // e.g., "Community Member"
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pages = pgTable("pages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").unique().notNull(),
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* -----------------------------------------------------
   Audit Logs
----------------------------------------------------- */

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource: text("resource"),
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

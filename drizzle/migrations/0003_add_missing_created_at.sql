ALTER TABLE "faq_categories" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "quicklink_categories" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;

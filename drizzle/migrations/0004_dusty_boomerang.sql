CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('Open', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"resource" text,
	"resource_id" text,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"role" text DEFAULT 'user',
	"expires_at" timestamp NOT NULL,
	"status" "invitation_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invitations_email_unique" UNIQUE("email"),
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_category_id_faq_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "news_articles" DROP CONSTRAINT "news_articles_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "quicklinks" DROP CONSTRAINT "quicklinks_category_id_quicklink_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'Open'::"public"."job_status";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DATA TYPE "public"."job_status" USING "status"::"public"."job_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "apply_url" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quicklinks" ADD CONSTRAINT "quicklinks_category_id_quicklink_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."quicklink_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_category_id_idx" ON "events" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "events_created_by_id_idx" ON "events" USING btree ("created_by_id");--> statement-breakpoint
CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "faqs_category_id_idx" ON "faqs" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "jobs_category_id_idx" ON "jobs" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "news_articles_category_id_idx" ON "news_articles" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "news_articles_author_id_idx" ON "news_articles" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "news_articles_slug_idx" ON "news_articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "news_images_article_id_idx" ON "news_images" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "quicklinks_category_id_idx" ON "quicklinks" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
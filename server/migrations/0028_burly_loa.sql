CREATE TABLE IF NOT EXISTS "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"enabled" boolean DEFAULT false,
	"organization_id" text
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "updatedAt" timestamp DEFAULT now();
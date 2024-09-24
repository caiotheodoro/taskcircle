CREATE TABLE IF NOT EXISTS "settings" (
	"id" text NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"enabled" boolean DEFAULT false,
	"organization_id" text,
	CONSTRAINT "settings_key_organization_id_pk" PRIMARY KEY("key","organization_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "settings" ADD CONSTRAINT "settings_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

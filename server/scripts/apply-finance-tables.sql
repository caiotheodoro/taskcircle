CREATE TABLE IF NOT EXISTS "earnings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "spendings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"installment_current" integer,
	"installment_total" integer,
	"created_at" timestamp DEFAULT now()
);

DO $$ BEGIN
 ALTER TABLE "earnings" ADD CONSTRAINT "earnings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "spendings" ADD CONSTRAINT "spendings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

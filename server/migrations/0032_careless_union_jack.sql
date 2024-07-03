ALTER TABLE "posts" DROP CONSTRAINT "posts_updatedBy_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

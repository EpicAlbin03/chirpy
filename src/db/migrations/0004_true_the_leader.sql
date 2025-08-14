ALTER TABLE "chirps" ALTER COLUMN "body" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "chirps" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "user_id" SET NOT NULL;
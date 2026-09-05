DROP INDEX `rsvps_email_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `rsvps_email_unique` ON `rsvps` (`email`) WHERE "rsvps"."email" <> '';
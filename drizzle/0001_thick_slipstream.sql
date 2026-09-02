CREATE TABLE `gift_reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`private_reference` text NOT NULL,
	`guest_name` text NOT NULL,
	`contact_detail` text NOT NULL,
	`preferred_reply_method` text NOT NULL,
	`request_type` text NOT NULL,
	`gift_key` text NOT NULL,
	`gift_label` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gift_reservations_private_reference_unique` ON `gift_reservations` (`private_reference`);--> statement-breakpoint
CREATE TABLE `submission_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`window_started_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `rsvps` ADD `submission_id` text;--> statement-breakpoint
ALTER TABLE `rsvps` ADD `consent_version` text DEFAULT 'wedding-privacy-v1' NOT NULL;--> statement-breakpoint
ALTER TABLE `rsvps` ADD `consented_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `rsvps_submission_id_unique` ON `rsvps` (`submission_id`);
CREATE TABLE `rsvps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference_code` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`attendance` text NOT NULL,
	`household_size` integer DEFAULT 1 NOT NULL,
	`guest_names` text DEFAULT '' NOT NULL,
	`selected_events` text DEFAULT '[]' NOT NULL,
	`meal_preference` text DEFAULT '' NOT NULL,
	`allergies` text DEFAULT '' NOT NULL,
	`accessibility_needs` text DEFAULT '' NOT NULL,
	`song_request` text DEFAULT '' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rsvps_email_unique` ON `rsvps` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `rsvps_reference_code_unique` ON `rsvps` (`reference_code`);
CREATE TABLE `user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL,
	`weight_unit` text DEFAULT 'kg' NOT NULL,
	`show_rpe` integer DEFAULT true NOT NULL,
	`show_tempo` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE INDEX `idx_user_preferences_user_id` ON `user_preferences` (`user_id`);--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `tempo` text;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `planned_tempo` text;
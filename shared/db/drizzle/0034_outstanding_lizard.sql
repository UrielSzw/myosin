PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL,
	`weight_unit` text DEFAULT 'kg' NOT NULL,
	`distance_unit` text DEFAULT 'metric' NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`show_rpe` integer DEFAULT true NOT NULL,
	`show_tempo` integer DEFAULT true NOT NULL,
	`keep_screen_awake` integer DEFAULT true NOT NULL,
	`haptic_feedback_enabled` integer DEFAULT true NOT NULL,
	`default_rest_time_seconds` integer DEFAULT 60 NOT NULL,
	`biological_sex` text,
	`birth_date` text,
	`height_cm` real,
	`initial_weight_kg` real,
	`fitness_goal` text,
	`activity_level` text,
	`onboarding_completed` integer DEFAULT false NOT NULL,
	`onboarding_completed_at` text,
	`is_synced` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
INSERT INTO `__new_user_preferences`("id", "user_id", "theme", "weight_unit", "distance_unit", "language", "show_rpe", "show_tempo", "keep_screen_awake", "haptic_feedback_enabled", "default_rest_time_seconds", "biological_sex", "birth_date", "height_cm", "initial_weight_kg", "fitness_goal", "activity_level", "onboarding_completed", "onboarding_completed_at", "is_synced", "created_at", "updated_at") SELECT "id", "user_id", "theme", "weight_unit", "distance_unit", "language", "show_rpe", "show_tempo", "keep_screen_awake", "haptic_feedback_enabled", "default_rest_time_seconds", "biological_sex", "birth_date", "height_cm", "initial_weight_kg", "fitness_goal", "activity_level", "onboarding_completed", "onboarding_completed_at", "is_synced", "created_at", "updated_at" FROM `user_preferences`;--> statement-breakpoint
DROP TABLE `user_preferences`;--> statement-breakpoint
ALTER TABLE `__new_user_preferences` RENAME TO `user_preferences`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_preferences_user_id` ON `user_preferences` (`user_id`);--> statement-breakpoint
ALTER TABLE `macro_daily_aggregates` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `macro_entries` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `macro_quick_actions` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `macro_targets` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_current` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_history` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `exercise_in_block` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `folders` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_blocks` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `routines` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tracker_daily_aggregates` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tracker_entries` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tracker_metrics` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tracker_quick_actions` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_blocks` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_exercises` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_sessions` ADD `is_synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `is_synced` integer DEFAULT false NOT NULL;
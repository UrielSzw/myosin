CREATE TABLE `exercise_progressions` (
	`id` text PRIMARY KEY NOT NULL,
	`from_exercise_id` text NOT NULL,
	`to_exercise_id` text NOT NULL,
	`relationship_type` text NOT NULL,
	`unlock_criteria` text,
	`difficulty_delta` integer DEFAULT 1,
	`notes` text,
	`source` text DEFAULT 'system',
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX `idx_progressions_from` ON `exercise_progressions` (`from_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_progressions_to` ON `exercise_progressions` (`to_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_progressions_type` ON `exercise_progressions` (`relationship_type`);--> statement-breakpoint
CREATE TABLE `progression_path_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`path_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`level` integer NOT NULL,
	`is_main_path` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX `idx_path_exercises_path` ON `progression_path_exercises` (`path_id`);--> statement-breakpoint
CREATE INDEX `idx_path_exercises_exercise` ON `progression_path_exercises` (`exercise_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_path_exercises_unique` ON `progression_path_exercises` (`path_id`,`exercise_id`);--> statement-breakpoint
CREATE TABLE `progression_paths` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name_key` text NOT NULL,
	`description_key` text,
	`category` text NOT NULL,
	`ultimate_exercise_id` text,
	`icon` text,
	`color` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `progression_paths_slug_unique` ON `progression_paths` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_paths_slug` ON `progression_paths` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_paths_category` ON `progression_paths` (`category`);--> statement-breakpoint
CREATE TABLE `user_exercise_unlocks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`status` text DEFAULT 'locked' NOT NULL,
	`unlocked_at` text,
	`unlocked_by_exercise_id` text,
	`unlocked_by_pr_id` text,
	`current_progress` text,
	`manually_unlocked` integer DEFAULT false,
	`manually_unlocked_at` text,
	`is_synced` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_unlocks_user_exercise` ON `user_exercise_unlocks` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_unlocks_user` ON `user_exercise_unlocks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_unlocks_status` ON `user_exercise_unlocks` (`status`);
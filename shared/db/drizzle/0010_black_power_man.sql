CREATE TABLE `pr_current` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`exercise_id` text NOT NULL,
	`best_weight` real NOT NULL,
	`best_reps` integer NOT NULL,
	`estimated_1rm` real NOT NULL,
	`achieved_at` text NOT NULL,
	`source` text DEFAULT 'auto' NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pr_current_user_exercise` ON `pr_current` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE TABLE `pr_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`exercise_id` text NOT NULL,
	`weight` real NOT NULL,
	`reps` integer NOT NULL,
	`estimated_1rm` real NOT NULL,
	`workout_session_id` text,
	`workout_set_id` text,
	`source` text DEFAULT 'auto' NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_set_id`) REFERENCES `workout_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pr_history_user_exercise` ON `pr_history` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_pr_history_session` ON `pr_history` (`workout_session_id`);
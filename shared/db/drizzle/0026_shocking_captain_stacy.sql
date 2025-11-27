PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`workout_session_id` text NOT NULL,
	`type` text NOT NULL,
	`order_index` integer NOT NULL,
	`name` text NOT NULL,
	`rest_time_seconds` integer NOT NULL,
	`rest_between_exercises_seconds` integer NOT NULL,
	`was_added_during_workout` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workout_blocks`("id", "user_id", "workout_session_id", "type", "order_index", "name", "rest_time_seconds", "rest_between_exercises_seconds", "was_added_during_workout", "created_at", "updated_at") SELECT "id", "user_id", "workout_session_id", "type", "order_index", "name", "rest_time_seconds", "rest_between_exercises_seconds", "was_added_during_workout", "created_at", "updated_at" FROM `workout_blocks`;--> statement-breakpoint
DROP TABLE `workout_blocks`;--> statement-breakpoint
ALTER TABLE `__new_workout_blocks` RENAME TO `workout_blocks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_user_id` ON `workout_blocks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_session_id` ON `workout_blocks` (`user_id`,`workout_session_id`);--> statement-breakpoint
CREATE TABLE `__new_workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`workout_block_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`execution_order` integer,
	`notes` text,
	`was_added_during_workout` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`workout_block_id`) REFERENCES `workout_blocks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_exercises`("id", "user_id", "workout_block_id", "exercise_id", "order_index", "execution_order", "notes", "was_added_during_workout", "created_at", "updated_at") SELECT "id", "user_id", "workout_block_id", "exercise_id", "order_index", "execution_order", "notes", "was_added_during_workout", "created_at", "updated_at" FROM `workout_exercises`;--> statement-breakpoint
DROP TABLE `workout_exercises`;--> statement-breakpoint
ALTER TABLE `__new_workout_exercises` RENAME TO `workout_exercises`;--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_user_id` ON `workout_exercises` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_block_id` ON `workout_exercises` (`user_id`,`workout_block_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_exercise_id` ON `workout_exercises` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_execution_order` ON `workout_exercises` (`user_id`,`execution_order`);--> statement-breakpoint
CREATE TABLE `__new_workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`measurement_template` text NOT NULL,
	`planned_primary_value` real,
	`planned_secondary_value` real,
	`planned_primary_range` text,
	`planned_secondary_range` text,
	`planned_rpe` real,
	`planned_tempo` text,
	`actual_primary_value` real,
	`actual_secondary_value` real,
	`actual_rpe` real,
	`set_type` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_sets`("id", "user_id", "workout_exercise_id", "exercise_id", "order_index", "measurement_template", "planned_primary_value", "planned_secondary_value", "planned_primary_range", "planned_secondary_range", "planned_rpe", "planned_tempo", "actual_primary_value", "actual_secondary_value", "actual_rpe", "set_type", "completed", "created_at", "updated_at") SELECT "id", "user_id", "workout_exercise_id", "exercise_id", "order_index", "measurement_template", "planned_primary_value", "planned_secondary_value", "planned_primary_range", "planned_secondary_range", "planned_rpe", "planned_tempo", "actual_primary_value", "actual_secondary_value", "actual_rpe", "set_type", "completed", "created_at", "updated_at" FROM `workout_sets`;--> statement-breakpoint
DROP TABLE `workout_sets`;--> statement-breakpoint
ALTER TABLE `__new_workout_sets` RENAME TO `workout_sets`;--> statement-breakpoint
CREATE INDEX `idx_workout_sets_user_id` ON `workout_sets` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_exercise_id` ON `workout_sets` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_workout_exercise_id` ON `workout_sets` (`user_id`,`workout_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_completed` ON `workout_sets` (`user_id`,`completed`);--> statement-breakpoint
ALTER TABLE `routines` ADD `deleted_at` text;
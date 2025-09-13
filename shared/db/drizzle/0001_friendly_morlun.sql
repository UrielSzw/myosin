CREATE TABLE `workout_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_session_id` text NOT NULL,
	`original_block_id` text,
	`type` text NOT NULL,
	`order_index` integer NOT NULL,
	`name` text NOT NULL,
	`rest_time_seconds` integer NOT NULL,
	`rest_between_exercises_seconds` integer NOT NULL,
	`was_added_during_workout` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`original_block_id`) REFERENCES `routine_blocks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_session_id` ON `workout_blocks` (`workout_session_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_original_id` ON `workout_blocks` (`original_block_id`);--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_block_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`original_exercise_in_block_id` text,
	`order_index` integer NOT NULL,
	`execution_order` integer,
	`notes` text,
	`was_added_during_workout` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`workout_block_id`) REFERENCES `workout_blocks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`original_exercise_in_block_id`) REFERENCES `exercise_in_block`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_block_id` ON `workout_exercises` (`workout_block_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_exercise_id` ON `workout_exercises` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_execution_order` ON `workout_exercises` (`execution_order`);--> statement-breakpoint
CREATE TABLE `workout_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`started_at` text NOT NULL,
	`finished_at` text NOT NULL,
	`total_duration_seconds` integer NOT NULL,
	`total_sets_planned` integer NOT NULL,
	`total_sets_completed` integer NOT NULL,
	`total_volume_kg` real,
	`average_rpe` real,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_routine_id` ON `workout_sessions` (`routine_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_started_at` ON `workout_sessions` (`started_at`);--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`original_set_id` text,
	`order_index` integer NOT NULL,
	`planned_weight` real,
	`planned_reps` integer,
	`planned_rpe` real,
	`actual_weight` real,
	`actual_reps` integer,
	`actual_rpe` real,
	`set_type` text NOT NULL,
	`reps_type` text NOT NULL,
	`reps_range` blob,
	`completed` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`original_set_id`) REFERENCES `routine_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_workout_sets_exercise_id` ON `workout_sets` (`workout_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_original_id` ON `workout_sets` (`original_set_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_completed` ON `workout_sets` (`completed`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`created_by_user_id` text,
	`main_muscle_group` text NOT NULL,
	`primary_equipment` text NOT NULL,
	`instructions` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "name", "source", "created_by_user_id", "main_muscle_group", "primary_equipment", "instructions", "updated_at", "created_at") SELECT "id", "name", "source", "created_by_user_id", "main_muscle_group", "primary_equipment", "instructions", "updated_at", "created_at" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_exercises_name` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_main_muscle` ON `exercises` (`main_muscle_group`);--> statement-breakpoint
CREATE INDEX `idx_exercises_primary_equipment` ON `exercises` (`primary_equipment`);
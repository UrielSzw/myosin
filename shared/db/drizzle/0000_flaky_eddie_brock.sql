CREATE TABLE `exercise_equipment` (
	`exercise_id` text NOT NULL,
	`equipment` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `equipment`)
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_equipment` ON `exercise_equipment` (`equipment`);--> statement-breakpoint
CREATE TABLE `exercise_images` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`url` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_images_exercise_id` ON `exercise_images` (`exercise_id`);--> statement-breakpoint
CREATE TABLE `exercise_muscle_groups` (
	`exercise_id` text NOT NULL,
	`muscle_group` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_group`)
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle` ON `exercise_muscle_groups` (`muscle_group`);--> statement-breakpoint
CREATE TABLE `exercise_in_block` (
	`id` text PRIMARY KEY NOT NULL,
	`block_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`notes` text,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`block_id`) REFERENCES `routine_blocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`created_by_user_id` text,
	`main_muscle_group` text NOT NULL,
	`primary_equipment` text NOT NULL,
	`instructions` blob NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE INDEX `idx_exercises_name` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_main_muscle` ON `exercises` (`main_muscle_group`);--> statement-breakpoint
CREATE INDEX `idx_exercises_primary_equipment` ON `exercises` (`primary_equipment`);--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`order_index` integer NOT NULL,
	`created_by_user_id` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE TABLE `routine_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`type` text NOT NULL,
	`order_index` integer NOT NULL,
	`rest_time_seconds` integer NOT NULL,
	`rest_between_exercises_seconds` integer NOT NULL,
	`name` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routine_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_in_block_id` text NOT NULL,
	`reps` integer,
	`weight` real,
	`rpe` real,
	`order_index` integer NOT NULL,
	`set_type` text NOT NULL,
	`reps_type` text NOT NULL,
	`reps_range` blob,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`exercise_in_block_id`) REFERENCES `exercise_in_block`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`folder_id` text,
	`created_by_user_id` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);

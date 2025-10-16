PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`original_set_id` text,
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
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`original_set_id`) REFERENCES `routine_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_sets`("id", "user_id", "workout_exercise_id", "exercise_id", "original_set_id", "order_index", "measurement_template", "planned_primary_value", "planned_secondary_value", "planned_primary_range", "planned_secondary_range", "planned_rpe", "planned_tempo", "actual_primary_value", "actual_secondary_value", "actual_rpe", "set_type", "completed", "updated_at", "created_at") SELECT "id", "user_id", "workout_exercise_id", "exercise_id", "original_set_id", "order_index", "measurement_template", "planned_primary_value", "planned_secondary_value", "planned_primary_range", "planned_secondary_range", "planned_rpe", "planned_tempo", "actual_primary_value", "actual_secondary_value", "actual_rpe", "set_type", "completed", "updated_at", "created_at" FROM `workout_sets`;--> statement-breakpoint
DROP TABLE `workout_sets`;--> statement-breakpoint
ALTER TABLE `__new_workout_sets` RENAME TO `workout_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_workout_sets_user_id` ON `workout_sets` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_exercise_id` ON `workout_sets` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_workout_exercise_id` ON `workout_sets` (`user_id`,`workout_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_original_id` ON `workout_sets` (`user_id`,`original_set_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_completed` ON `workout_sets` (`user_id`,`completed`);
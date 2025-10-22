PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pr_current` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`exercise_id` text NOT NULL,
	`best_weight` real NOT NULL,
	`best_reps` integer NOT NULL,
	`estimated_1rm` real NOT NULL,
	`achieved_at` text NOT NULL,
	`source` text DEFAULT 'auto' NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_pr_current`("id", "user_id", "exercise_id", "best_weight", "best_reps", "estimated_1rm", "achieved_at", "source", "updated_at", "created_at") SELECT "id", "user_id", "exercise_id", "best_weight", "best_reps", "estimated_1rm", "achieved_at", "source", "updated_at", "created_at" FROM `pr_current`;--> statement-breakpoint
DROP TABLE `pr_current`;--> statement-breakpoint
ALTER TABLE `__new_pr_current` RENAME TO `pr_current`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_pr_current_user_exercise` ON `pr_current` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE TABLE `__new_pr_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`exercise_id` text NOT NULL,
	`weight` real NOT NULL,
	`reps` integer NOT NULL,
	`estimated_1rm` real NOT NULL,
	`workout_session_id` text,
	`workout_set_id` text,
	`source` text DEFAULT 'auto' NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_set_id`) REFERENCES `workout_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_pr_history`("id", "user_id", "exercise_id", "weight", "reps", "estimated_1rm", "workout_session_id", "workout_set_id", "source", "updated_at", "created_at") SELECT "id", "user_id", "exercise_id", "weight", "reps", "estimated_1rm", "workout_session_id", "workout_set_id", "source", "updated_at", "created_at" FROM `pr_history`;--> statement-breakpoint
DROP TABLE `pr_history`;--> statement-breakpoint
ALTER TABLE `__new_pr_history` RENAME TO `pr_history`;--> statement-breakpoint
CREATE INDEX `idx_pr_history_user_exercise` ON `pr_history` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_pr_history_session` ON `pr_history` (`workout_session_id`);--> statement-breakpoint
CREATE TABLE `__new_exercise_in_block` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`block_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`notes` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`block_id`) REFERENCES `routine_blocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exercise_in_block`("id", "user_id", "block_id", "exercise_id", "order_index", "notes", "updated_at", "created_at") SELECT "id", "user_id", "block_id", "exercise_id", "order_index", "notes", "updated_at", "created_at" FROM `exercise_in_block`;--> statement-breakpoint
DROP TABLE `exercise_in_block`;--> statement-breakpoint
ALTER TABLE `__new_exercise_in_block` RENAME TO `exercise_in_block`;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`created_by_user_id` text,
	`main_muscle_group` text NOT NULL,
	`primary_equipment` text NOT NULL,
	`exercise_type` text NOT NULL,
	`secondary_muscle_groups` text NOT NULL,
	`instructions` text NOT NULL,
	`equipment` text NOT NULL,
	`similar_exercises` text,
	`default_measurement_template` text DEFAULT 'weight_reps' NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000)
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "name", "source", "created_by_user_id", "main_muscle_group", "primary_equipment", "exercise_type", "secondary_muscle_groups", "instructions", "equipment", "similar_exercises", "default_measurement_template", "updated_at", "created_at") SELECT "id", "name", "source", "created_by_user_id", "main_muscle_group", "primary_equipment", "exercise_type", "secondary_muscle_groups", "instructions", "equipment", "similar_exercises", "default_measurement_template", "updated_at", "created_at" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
CREATE INDEX `idx_exercises_name` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_main_muscle` ON `exercises` (`main_muscle_group`);--> statement-breakpoint
CREATE INDEX `idx_exercises_primary_equipment` ON `exercises` (`primary_equipment`);--> statement-breakpoint
CREATE TABLE `__new_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`order_index` integer NOT NULL,
	`created_by_user_id` text NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000)
);
--> statement-breakpoint
INSERT INTO `__new_folders`("id", "name", "color", "icon", "order_index", "created_by_user_id", "updated_at", "created_at") SELECT "id", "name", "color", "icon", "order_index", "created_by_user_id", "updated_at", "created_at" FROM `folders`;--> statement-breakpoint
DROP TABLE `folders`;--> statement-breakpoint
ALTER TABLE `__new_folders` RENAME TO `folders`;--> statement-breakpoint
CREATE TABLE `__new_routine_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`routine_id` text NOT NULL,
	`type` text NOT NULL,
	`order_index` integer NOT NULL,
	`rest_time_seconds` integer NOT NULL,
	`rest_between_exercises_seconds` integer NOT NULL,
	`name` text NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routine_blocks`("id", "user_id", "routine_id", "type", "order_index", "rest_time_seconds", "rest_between_exercises_seconds", "name", "updated_at", "created_at") SELECT "id", "user_id", "routine_id", "type", "order_index", "rest_time_seconds", "rest_between_exercises_seconds", "name", "updated_at", "created_at" FROM `routine_blocks`;--> statement-breakpoint
DROP TABLE `routine_blocks`;--> statement-breakpoint
ALTER TABLE `__new_routine_blocks` RENAME TO `routine_blocks`;--> statement-breakpoint
CREATE TABLE `__new_routine_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`exercise_in_block_id` text NOT NULL,
	`measurement_template` text NOT NULL,
	`primary_value` real,
	`secondary_value` real,
	`primary_range` text,
	`secondary_range` text,
	`rpe` real,
	`tempo` text,
	`order_index` integer NOT NULL,
	`set_type` text NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`exercise_in_block_id`) REFERENCES `exercise_in_block`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routine_sets`("id", "user_id", "exercise_in_block_id", "measurement_template", "primary_value", "secondary_value", "primary_range", "secondary_range", "rpe", "tempo", "order_index", "set_type", "updated_at", "created_at") SELECT "id", "user_id", "exercise_in_block_id", "measurement_template", "primary_value", "secondary_value", "primary_range", "secondary_range", "rpe", "tempo", "order_index", "set_type", "updated_at", "created_at" FROM `routine_sets`;--> statement-breakpoint
DROP TABLE `routine_sets`;--> statement-breakpoint
ALTER TABLE `__new_routine_sets` RENAME TO `routine_sets`;--> statement-breakpoint
CREATE TABLE `__new_routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`folder_id` text,
	`created_by_user_id` text NOT NULL,
	`training_days` text,
	`show_rpe` integer DEFAULT true NOT NULL,
	`show_tempo` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routines`("id", "name", "folder_id", "created_by_user_id", "training_days", "show_rpe", "show_tempo", "updated_at", "created_at") SELECT "id", "name", "folder_id", "created_by_user_id", "training_days", "show_rpe", "show_tempo", "updated_at", "created_at" FROM `routines`;--> statement-breakpoint
DROP TABLE `routines`;--> statement-breakpoint
ALTER TABLE `__new_routines` RENAME TO `routines`;--> statement-breakpoint
CREATE TABLE `__new_tracker_daily_aggregates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`metric_id` text NOT NULL,
	`day_key` text NOT NULL,
	`sum_normalized` real NOT NULL,
	`count` integer NOT NULL,
	`min_normalized` real,
	`max_normalized` real,
	`avg_normalized` real,
	`previous_day_sum` real,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`metric_id`) REFERENCES `tracker_metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tracker_daily_aggregates`("id", "user_id", "metric_id", "day_key", "sum_normalized", "count", "min_normalized", "max_normalized", "avg_normalized", "previous_day_sum", "updated_at", "created_at") SELECT "id", "user_id", "metric_id", "day_key", "sum_normalized", "count", "min_normalized", "max_normalized", "avg_normalized", "previous_day_sum", "updated_at", "created_at" FROM `tracker_daily_aggregates`;--> statement-breakpoint
DROP TABLE `tracker_daily_aggregates`;--> statement-breakpoint
ALTER TABLE `__new_tracker_daily_aggregates` RENAME TO `tracker_daily_aggregates`;--> statement-breakpoint
CREATE INDEX `idx_tracker_aggregates_unique` ON `tracker_daily_aggregates` (`user_id`,`metric_id`,`day_key`);--> statement-breakpoint
CREATE INDEX `idx_tracker_aggregates_day_key` ON `tracker_daily_aggregates` (`day_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_metric_day` ON `tracker_daily_aggregates` (`user_id`,`metric_id`,`day_key`);--> statement-breakpoint
CREATE TABLE `__new_tracker_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`metric_id` text NOT NULL,
	`value` real NOT NULL,
	`value_normalized` real NOT NULL,
	`unit` text NOT NULL,
	`notes` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`day_key` text NOT NULL,
	`recorded_at` text NOT NULL,
	`meta` blob,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`metric_id`) REFERENCES `tracker_metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tracker_entries`("id", "user_id", "metric_id", "value", "value_normalized", "unit", "notes", "source", "day_key", "recorded_at", "meta", "updated_at", "created_at") SELECT "id", "user_id", "metric_id", "value", "value_normalized", "unit", "notes", "source", "day_key", "recorded_at", "meta", "updated_at", "created_at" FROM `tracker_entries`;--> statement-breakpoint
DROP TABLE `tracker_entries`;--> statement-breakpoint
ALTER TABLE `__new_tracker_entries` RENAME TO `tracker_entries`;--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_user_metric` ON `tracker_entries` (`user_id`,`metric_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_day_key` ON `tracker_entries` (`day_key`);--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_recorded_at` ON `tracker_entries` (`recorded_at`);--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_source` ON `tracker_entries` (`source`);--> statement-breakpoint
CREATE TABLE `__new_tracker_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`unit` text NOT NULL,
	`canonical_unit` text,
	`conversion_factor` real DEFAULT 1,
	`default_target` real,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`deleted_at` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000)
);
--> statement-breakpoint
INSERT INTO `__new_tracker_metrics`("id", "user_id", "slug", "name", "type", "unit", "canonical_unit", "conversion_factor", "default_target", "color", "icon", "deleted_at", "order_index", "updated_at", "created_at") SELECT "id", "user_id", "slug", "name", "type", "unit", "canonical_unit", "conversion_factor", "default_target", "color", "icon", "deleted_at", "order_index", "updated_at", "created_at" FROM `tracker_metrics`;--> statement-breakpoint
DROP TABLE `tracker_metrics`;--> statement-breakpoint
ALTER TABLE `__new_tracker_metrics` RENAME TO `tracker_metrics`;--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_user_id` ON `tracker_metrics` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_slug` ON `tracker_metrics` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_type` ON `tracker_metrics` (`type`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_deleted_at` ON `tracker_metrics` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `__new_tracker_quick_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`metric_id` text NOT NULL,
	`label` text NOT NULL,
	`value` real NOT NULL,
	`value_normalized` real,
	`icon` text,
	`position` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`metric_id`) REFERENCES `tracker_metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tracker_quick_actions`("id", "metric_id", "label", "value", "value_normalized", "icon", "position", "updated_at", "created_at") SELECT "id", "metric_id", "label", "value", "value_normalized", "icon", "position", "updated_at", "created_at" FROM `tracker_quick_actions`;--> statement-breakpoint
DROP TABLE `tracker_quick_actions`;--> statement-breakpoint
ALTER TABLE `__new_tracker_quick_actions` RENAME TO `tracker_quick_actions`;--> statement-breakpoint
CREATE INDEX `idx_tracker_quick_actions_metric` ON `tracker_quick_actions` (`metric_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_quick_actions_position` ON `tracker_quick_actions` (`position`);--> statement-breakpoint
CREATE TABLE `__new_user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL,
	`weight_unit` text DEFAULT 'kg' NOT NULL,
	`show_rpe` integer DEFAULT true NOT NULL,
	`show_tempo` integer DEFAULT true NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000)
);
--> statement-breakpoint
INSERT INTO `__new_user_preferences`("id", "user_id", "theme", "weight_unit", "show_rpe", "show_tempo", "updated_at", "created_at") SELECT "id", "user_id", "theme", "weight_unit", "show_rpe", "show_tempo", "updated_at", "created_at" FROM `user_preferences`;--> statement-breakpoint
DROP TABLE `user_preferences`;--> statement-breakpoint
ALTER TABLE `__new_user_preferences` RENAME TO `user_preferences`;--> statement-breakpoint
CREATE INDEX `idx_user_preferences_user_id` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_workout_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`workout_session_id` text NOT NULL,
	`original_block_id` text,
	`type` text NOT NULL,
	`order_index` integer NOT NULL,
	`name` text NOT NULL,
	`rest_time_seconds` integer NOT NULL,
	`rest_between_exercises_seconds` integer NOT NULL,
	`was_added_during_workout` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`original_block_id`) REFERENCES `routine_blocks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_blocks`("id", "user_id", "workout_session_id", "original_block_id", "type", "order_index", "name", "rest_time_seconds", "rest_between_exercises_seconds", "was_added_during_workout", "updated_at", "created_at") SELECT "id", "user_id", "workout_session_id", "original_block_id", "type", "order_index", "name", "rest_time_seconds", "rest_between_exercises_seconds", "was_added_during_workout", "updated_at", "created_at" FROM `workout_blocks`;--> statement-breakpoint
DROP TABLE `workout_blocks`;--> statement-breakpoint
ALTER TABLE `__new_workout_blocks` RENAME TO `workout_blocks`;--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_user_id` ON `workout_blocks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_session_id` ON `workout_blocks` (`user_id`,`workout_session_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_original_id` ON `workout_blocks` (`user_id`,`original_block_id`);--> statement-breakpoint
CREATE TABLE `__new_workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`workout_block_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`original_exercise_in_block_id` text,
	`order_index` integer NOT NULL,
	`execution_order` integer,
	`notes` text,
	`was_added_during_workout` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`workout_block_id`) REFERENCES `workout_blocks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`original_exercise_in_block_id`) REFERENCES `exercise_in_block`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_exercises`("id", "user_id", "workout_block_id", "exercise_id", "original_exercise_in_block_id", "order_index", "execution_order", "notes", "was_added_during_workout", "updated_at", "created_at") SELECT "id", "user_id", "workout_block_id", "exercise_id", "original_exercise_in_block_id", "order_index", "execution_order", "notes", "was_added_during_workout", "updated_at", "created_at" FROM `workout_exercises`;--> statement-breakpoint
DROP TABLE `workout_exercises`;--> statement-breakpoint
ALTER TABLE `__new_workout_exercises` RENAME TO `workout_exercises`;--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_user_id` ON `workout_exercises` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_block_id` ON `workout_exercises` (`user_id`,`workout_block_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_exercise_id` ON `workout_exercises` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_execution_order` ON `workout_exercises` (`user_id`,`execution_order`);--> statement-breakpoint
CREATE TABLE `__new_workout_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`routine_id` text NOT NULL,
	`started_at` text NOT NULL,
	`finished_at` text NOT NULL,
	`total_duration_seconds` integer NOT NULL,
	`total_sets_planned` integer NOT NULL,
	`total_sets_completed` integer NOT NULL,
	`total_volume_kg` real,
	`average_rpe` real,
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_sessions`("id", "user_id", "routine_id", "started_at", "finished_at", "total_duration_seconds", "total_sets_planned", "total_sets_completed", "total_volume_kg", "average_rpe", "updated_at", "created_at") SELECT "id", "user_id", "routine_id", "started_at", "finished_at", "total_duration_seconds", "total_sets_planned", "total_sets_completed", "total_volume_kg", "average_rpe", "updated_at", "created_at" FROM `workout_sessions`;--> statement-breakpoint
DROP TABLE `workout_sessions`;--> statement-breakpoint
ALTER TABLE `__new_workout_sessions` RENAME TO `workout_sessions`;--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_user_id` ON `workout_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_routine_id` ON `workout_sessions` (`user_id`,`routine_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_started_at` ON `workout_sessions` (`user_id`,`started_at`);--> statement-breakpoint
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
	`updated_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`original_set_id`) REFERENCES `routine_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_sets`("id", "user_id", "workout_exercise_id", "exercise_id", "original_set_id", "order_index", "measurement_template", "planned_primary_value", "planned_secondary_value", "planned_primary_range", "planned_secondary_range", "planned_rpe", "planned_tempo", "actual_primary_value", "actual_secondary_value", "actual_rpe", "set_type", "completed", "updated_at", "created_at") SELECT "id", "user_id", "workout_exercise_id", "exercise_id", "original_set_id", "order_index", "measurement_template", "planned_primary_value", "planned_secondary_value", "planned_primary_range", "planned_secondary_range", "planned_rpe", "planned_tempo", "actual_primary_value", "actual_secondary_value", "actual_rpe", "set_type", "completed", "updated_at", "created_at" FROM `workout_sets`;--> statement-breakpoint
DROP TABLE `workout_sets`;--> statement-breakpoint
ALTER TABLE `__new_workout_sets` RENAME TO `workout_sets`;--> statement-breakpoint
CREATE INDEX `idx_workout_sets_user_id` ON `workout_sets` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_exercise_id` ON `workout_sets` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_workout_exercise_id` ON `workout_sets` (`user_id`,`workout_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_original_id` ON `workout_sets` (`user_id`,`original_set_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_completed` ON `workout_sets` (`user_id`,`completed`);
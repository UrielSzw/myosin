ALTER TABLE `exercises` ADD `default_measurement_template` text DEFAULT 'weight_reps' NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `measurement_template` text NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `primary_value` real;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `secondary_value` real;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `primary_range` blob;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `secondary_range` blob;--> statement-breakpoint
ALTER TABLE `routine_sets` DROP COLUMN `reps`;--> statement-breakpoint
ALTER TABLE `routine_sets` DROP COLUMN `weight`;--> statement-breakpoint
ALTER TABLE `routine_sets` DROP COLUMN `reps_type`;--> statement-breakpoint
ALTER TABLE `routine_sets` DROP COLUMN `reps_range`;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `measurement_template` text NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `planned_primary_value` real;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `planned_secondary_value` real;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `planned_primary_range` blob;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `planned_secondary_range` blob;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `actual_primary_value` real;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `actual_secondary_value` real;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `actual_primary_range` blob;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `actual_secondary_range` blob;--> statement-breakpoint
ALTER TABLE `workout_sets` DROP COLUMN `planned_weight`;--> statement-breakpoint
ALTER TABLE `workout_sets` DROP COLUMN `planned_reps`;--> statement-breakpoint
ALTER TABLE `workout_sets` DROP COLUMN `actual_weight`;--> statement-breakpoint
ALTER TABLE `workout_sets` DROP COLUMN `actual_reps`;--> statement-breakpoint
ALTER TABLE `workout_sets` DROP COLUMN `reps_type`;--> statement-breakpoint
ALTER TABLE `workout_sets` DROP COLUMN `reps_range`;
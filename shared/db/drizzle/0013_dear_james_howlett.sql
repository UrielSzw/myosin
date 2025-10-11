ALTER TABLE `exercises` RENAME COLUMN "muscle_groups" TO "secondary_muscle_groups";--> statement-breakpoint
DROP TABLE `exercise_equipment`;--> statement-breakpoint
DROP TABLE `exercise_muscle_groups`;--> statement-breakpoint
ALTER TABLE `exercises` ADD `exercise_type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` ADD `similar_exercises` text;--> statement-breakpoint
ALTER TABLE `tracker_metrics` DROP COLUMN `settings`;
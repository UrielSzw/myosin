ALTER TABLE `pr_current` ADD `measurement_template` text DEFAULT 'weight_reps' NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_current` ADD `best_primary_value` real NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_current` ADD `best_secondary_value` real;--> statement-breakpoint
ALTER TABLE `pr_current` ADD `pr_score` real NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_current` DROP COLUMN `best_weight`;--> statement-breakpoint
ALTER TABLE `pr_current` DROP COLUMN `best_reps`;--> statement-breakpoint
ALTER TABLE `pr_current` DROP COLUMN `estimated_1rm`;--> statement-breakpoint
ALTER TABLE `pr_history` ADD `measurement_template` text DEFAULT 'weight_reps' NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_history` ADD `primary_value` real NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_history` ADD `secondary_value` real;--> statement-breakpoint
ALTER TABLE `pr_history` ADD `pr_score` real NOT NULL;--> statement-breakpoint
ALTER TABLE `pr_history` DROP COLUMN `weight`;--> statement-breakpoint
ALTER TABLE `pr_history` DROP COLUMN `reps`;--> statement-breakpoint
ALTER TABLE `pr_history` DROP COLUMN `estimated_1rm`;
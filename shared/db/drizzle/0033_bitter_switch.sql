ALTER TABLE `user_preferences` ADD `biological_sex` text;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `birth_date` text;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `height_cm` real;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `initial_weight_kg` real;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `fitness_goal` text;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `activity_level` text;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `onboarding_completed` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `onboarding_completed_at` text;
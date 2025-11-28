ALTER TABLE `exercises` ADD `name_search` text;--> statement-breakpoint
CREATE INDEX `idx_exercises_name_search` ON `exercises` (`name_search`);
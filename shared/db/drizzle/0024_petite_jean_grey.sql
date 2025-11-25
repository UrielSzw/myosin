ALTER TABLE `tracker_quick_actions` ADD `slug` text;--> statement-breakpoint
CREATE INDEX `idx_tracker_quick_actions_slug` ON `tracker_quick_actions` (`slug`);
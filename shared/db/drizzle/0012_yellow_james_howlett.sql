DROP INDEX `idx_tracker_metrics_active`;--> statement-breakpoint
ALTER TABLE `tracker_metrics` ADD `deleted_at` text;--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_deleted_at` ON `tracker_metrics` (`deleted_at`);--> statement-breakpoint
ALTER TABLE `tracker_metrics` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `tracker_metrics` DROP COLUMN `is_predefined`;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_metric_day` ON `tracker_daily_aggregates` (`user_id`,`metric_id`,`day_key`);
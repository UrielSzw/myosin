PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tracker_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`input_type` text DEFAULT 'numeric_single' NOT NULL,
	`behavior` text DEFAULT 'replace' NOT NULL,
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
INSERT INTO `__new_tracker_metrics`("id", "user_id", "slug", "name", "input_type", "behavior", "unit", "canonical_unit", "conversion_factor", "default_target", "color", "icon", "deleted_at", "order_index", "updated_at", "created_at") SELECT "id", "user_id", "slug", "name", "input_type", "behavior", "unit", "canonical_unit", "conversion_factor", "default_target", "color", "icon", "deleted_at", "order_index", "updated_at", "created_at" FROM `tracker_metrics`;--> statement-breakpoint
DROP TABLE `tracker_metrics`;--> statement-breakpoint
ALTER TABLE `__new_tracker_metrics` RENAME TO `tracker_metrics`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_user_id` ON `tracker_metrics` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_slug` ON `tracker_metrics` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_input_type` ON `tracker_metrics` (`input_type`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_deleted_at` ON `tracker_metrics` (`deleted_at`);--> statement-breakpoint
ALTER TABLE `tracker_entries` ADD `display_value` text;--> statement-breakpoint
ALTER TABLE `tracker_entries` ADD `raw_input` blob;
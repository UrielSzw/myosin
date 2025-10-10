CREATE TABLE `tracker_daily_aggregates` (
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
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`metric_id`) REFERENCES `tracker_metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tracker_aggregates_unique` ON `tracker_daily_aggregates` (`user_id`,`metric_id`,`day_key`);--> statement-breakpoint
CREATE INDEX `idx_tracker_aggregates_day_key` ON `tracker_daily_aggregates` (`day_key`);--> statement-breakpoint
CREATE TABLE `tracker_entries` (
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
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`metric_id`) REFERENCES `tracker_metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_user_metric` ON `tracker_entries` (`user_id`,`metric_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_day_key` ON `tracker_entries` (`day_key`);--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_recorded_at` ON `tracker_entries` (`recorded_at`);--> statement-breakpoint
CREATE INDEX `idx_tracker_entries_source` ON `tracker_entries` (`source`);--> statement-breakpoint
CREATE TABLE `tracker_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`unit` text NOT NULL,
	`canonical_unit` text,
	`conversion_factor` real DEFAULT 1,
	`default_target` real,
	`settings` blob,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`is_predefined` integer DEFAULT false NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_user_id` ON `tracker_metrics` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_slug` ON `tracker_metrics` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_type` ON `tracker_metrics` (`type`);--> statement-breakpoint
CREATE INDEX `idx_tracker_metrics_active` ON `tracker_metrics` (`is_active`);--> statement-breakpoint
CREATE TABLE `tracker_quick_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`metric_id` text NOT NULL,
	`label` text NOT NULL,
	`value` real NOT NULL,
	`value_normalized` real,
	`icon` text,
	`position` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`metric_id`) REFERENCES `tracker_metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tracker_quick_actions_metric` ON `tracker_quick_actions` (`metric_id`);--> statement-breakpoint
CREATE INDEX `idx_tracker_quick_actions_position` ON `tracker_quick_actions` (`position`);
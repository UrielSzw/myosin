CREATE TABLE `macro_daily_aggregates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`day_key` text NOT NULL,
	`total_protein` real NOT NULL,
	`total_carbs` real NOT NULL,
	`total_fats` real NOT NULL,
	`entry_count` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_macro_aggregate_day` ON `macro_daily_aggregates` (`user_id`,`day_key`);--> statement-breakpoint
CREATE INDEX `idx_macro_aggregates_day` ON `macro_daily_aggregates` (`day_key`);--> statement-breakpoint
CREATE TABLE `macro_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`protein` real NOT NULL,
	`carbs` real NOT NULL,
	`fats` real NOT NULL,
	`label` text,
	`notes` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`day_key` text NOT NULL,
	`recorded_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX `idx_macro_entries_user` ON `macro_entries` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_macro_entries_day` ON `macro_entries` (`user_id`,`day_key`);--> statement-breakpoint
CREATE INDEX `idx_macro_entries_recorded` ON `macro_entries` (`recorded_at`);--> statement-breakpoint
CREATE TABLE `macro_quick_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	`icon` text,
	`color` text,
	`protein` real NOT NULL,
	`carbs` real NOT NULL,
	`fats` real NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`is_predefined` integer DEFAULT false NOT NULL,
	`slug` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX `idx_macro_quick_actions_user` ON `macro_quick_actions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_macro_quick_actions_position` ON `macro_quick_actions` (`user_id`,`position`);--> statement-breakpoint
CREATE TABLE `macro_targets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`protein_target` real NOT NULL,
	`carbs_target` real NOT NULL,
	`fats_target` real NOT NULL,
	`name` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX `idx_macro_targets_user` ON `macro_targets` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_macro_targets_active` ON `macro_targets` (`user_id`,`is_active`);
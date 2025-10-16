PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default-user' NOT NULL,
	`exercise_in_block_id` text NOT NULL,
	`measurement_template` text NOT NULL,
	`primary_value` real,
	`secondary_value` real,
	`primary_range` text,
	`secondary_range` text,
	`rpe` real,
	`tempo` text,
	`order_index` integer NOT NULL,
	`set_type` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`exercise_in_block_id`) REFERENCES `exercise_in_block`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routine_sets`("id", "user_id", "exercise_in_block_id", "measurement_template", "primary_value", "secondary_value", "primary_range", "secondary_range", "rpe", "tempo", "order_index", "set_type", "updated_at", "created_at") SELECT "id", "user_id", "exercise_in_block_id", "measurement_template", "primary_value", "secondary_value", "primary_range", "secondary_range", "rpe", "tempo", "order_index", "set_type", "updated_at", "created_at" FROM `routine_sets`;--> statement-breakpoint
DROP TABLE `routine_sets`;--> statement-breakpoint
ALTER TABLE `__new_routine_sets` RENAME TO `routine_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
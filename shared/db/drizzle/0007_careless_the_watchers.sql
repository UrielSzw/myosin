PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`created_by_user_id` text,
	`main_muscle_group` text NOT NULL,
	`primary_equipment` text NOT NULL,
	`muscle_groups` text NOT NULL,
	`instructions` text NOT NULL,
	`equipment` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "name", "source", "created_by_user_id", "main_muscle_group", "primary_equipment", "muscle_groups", "instructions", "equipment", "updated_at", "created_at") SELECT "id", "name", "source", "created_by_user_id", "main_muscle_group", "primary_equipment", "muscle_groups", "instructions", "equipment", "updated_at", "created_at" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_exercises_name` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_main_muscle` ON `exercises` (`main_muscle_group`);--> statement-breakpoint
CREATE INDEX `idx_exercises_primary_equipment` ON `exercises` (`primary_equipment`);--> statement-breakpoint
CREATE TABLE `__new_routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`folder_id` text,
	`created_by_user_id` text NOT NULL,
	`training_days` text NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routines`("id", "name", "folder_id", "created_by_user_id", "training_days", "updated_at", "created_at") SELECT "id", "name", "folder_id", "created_by_user_id", "training_days", "updated_at", "created_at" FROM `routines`;--> statement-breakpoint
DROP TABLE `routines`;--> statement-breakpoint
ALTER TABLE `__new_routines` RENAME TO `routines`;
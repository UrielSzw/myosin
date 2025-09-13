DROP INDEX `idx_workout_blocks_session_id`;--> statement-breakpoint
DROP INDEX `idx_workout_blocks_original_id`;--> statement-breakpoint
ALTER TABLE `workout_blocks` ADD `user_id` text DEFAULT 'default-user' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_user_id` ON `workout_blocks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_session_id` ON `workout_blocks` (`user_id`,`workout_session_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_blocks_original_id` ON `workout_blocks` (`user_id`,`original_block_id`);--> statement-breakpoint
DROP INDEX `idx_workout_exercises_block_id`;--> statement-breakpoint
DROP INDEX `idx_workout_exercises_exercise_id`;--> statement-breakpoint
DROP INDEX `idx_workout_exercises_execution_order`;--> statement-breakpoint
ALTER TABLE `workout_exercises` ADD `user_id` text DEFAULT 'default-user' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_user_id` ON `workout_exercises` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_block_id` ON `workout_exercises` (`user_id`,`workout_block_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_exercise_id` ON `workout_exercises` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_execution_order` ON `workout_exercises` (`user_id`,`execution_order`);--> statement-breakpoint
DROP INDEX `idx_workout_sessions_routine_id`;--> statement-breakpoint
DROP INDEX `idx_workout_sessions_started_at`;--> statement-breakpoint
ALTER TABLE `workout_sessions` ADD `user_id` text DEFAULT 'default-user' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_user_id` ON `workout_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_routine_id` ON `workout_sessions` (`user_id`,`routine_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sessions_started_at` ON `workout_sessions` (`user_id`,`started_at`);--> statement-breakpoint
DROP INDEX `idx_workout_sets_exercise_id`;--> statement-breakpoint
DROP INDEX `idx_workout_sets_original_id`;--> statement-breakpoint
DROP INDEX `idx_workout_sets_completed`;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `user_id` text DEFAULT 'default-user' NOT NULL;--> statement-breakpoint
ALTER TABLE `workout_sets` ADD `exercise_id` text NOT NULL REFERENCES exercises(id);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_user_id` ON `workout_sets` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_workout_exercise_id` ON `workout_sets` (`user_id`,`workout_exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_exercise_id` ON `workout_sets` (`user_id`,`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_original_id` ON `workout_sets` (`user_id`,`original_set_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_sets_completed` ON `workout_sets` (`user_id`,`completed`);--> statement-breakpoint
ALTER TABLE `exercise_in_block` ADD `user_id` text DEFAULT 'default-user' NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_blocks` ADD `user_id` text DEFAULT 'default-user' NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_sets` ADD `user_id` text DEFAULT 'default-user' NOT NULL;
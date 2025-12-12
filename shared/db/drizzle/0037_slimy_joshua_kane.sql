ALTER TABLE `exercises` ADD `difficulty` integer DEFAULT 3;--> statement-breakpoint
ALTER TABLE `exercises` ADD `unilateral` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `exercises` ADD `movement_pattern` text;--> statement-breakpoint
ALTER TABLE `exercises` ADD `adds_bodyweight` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `exercises` ADD `common_mistakes` text;
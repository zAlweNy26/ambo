CREATE TABLE `extractions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_id` text NOT NULL,
	`numbers` text NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_id` text NOT NULL,
	`players_count` integer NOT NULL,
	`completed_at` integer NOT NULL,
	`total_extractions` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_game_id_unique` ON `games` (`game_id`);
CREATE TABLE `claims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_id` text NOT NULL,
	`prize` text NOT NULL,
	`player` text NOT NULL,
	`name` text NOT NULL,
	`draw` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `claims_game_id_prize_player_unique` ON `claims` (`game_id`,`prize`,`player`);

export const TIMER_AMOUNT_S = 60;

export const GAME_OVER_LOCALE = "Игра окончена :(";

export const BUCKET_CATCH_RANGE = 160;

export const PLAYER_INITIAL_PTS = 0;

export const PLAYER_INITIAL_HEALTH = 3;

export const FRUIT_SPAWN_RATE = 0.95;

export const BAD_FRUIT_SPAWN_RATE = 0.9;

export const BAD_FRUIT_DEFAULT_DMG = 1;

export const GOOD_FRUIT_DEFAULT_PTS = 50;

export const FRUIT_SPRITE_SCALE = 0.2;

export const SPRITES_BASE_PATH = "bmp/";

export const GOOD_FRUITS_SPRITE_PATHS = [

	"banana",
	"watermelon",
	"green-grape",
	"red-grape",
	"coconut",
	"red-cherry",
	"black-cherry",
	"star-fruit",
	"lime",
	"lemon",
	"strawberry",
	"black-berry-dark",
	"black-berry-light",
	"raspberry",
	"plum",
	"orange",
	"peach",
	"green-apple",
	"red-apple",
	"pear",
];

export const BAD_FRUITS_SPRITE_PATHS = [

	"mushroom"
];

// fruits movement

export const MIN_FALL_SPEED = 220;  // px/s
export const MAX_FALL_SPEED = 360;  // px/s
export const FALL_ACCEL = 720;  // px/s^2
export const ZIG_AMP_RANGE = [45, 89]; // px
export const ZIG_FREQ_RANGE = [0.8, 1.6]; // Hz

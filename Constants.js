.pragma library

/*
  Key handle
*/
var KEY_LEFT = 1
var KEY_RIGHT = 2
var KEY_UP = 3
var KEY_DOWN = 4
var KEY_PAUSE = 5

/*
  Some value default to init the game
*/
var BLOCK_SIZE_DEFAULT = 40
var MAX_COLUMN_DEFAULT = 10
var MAX_ROW_DEFAULT = 18
var ORIGIN_X_DEFAULT = 4
var ORIGIN_Y_DEFAULT = 0
var TYPE_FIGURE_DEFAULT = 1
var ORIENTATION_DEFAULT = 0

var color = ["red", "blue", "green"]

/*
  State of SOUND
*/
var NEW_LEVEL_SOUND = 0
var MOVING_SOUND = 1
var REMOVE_ROW_SOUND = 2
var GAME_OVER_SOUND = 3

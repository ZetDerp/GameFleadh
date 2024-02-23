console.log("declareVars.js Running");

// Create Canvas
let gameCanvas = document.getElementById("gameCanvas");
gameCanvas.style.display = "block";
let ctx = gameCanvas.getContext("2d");
ctx.fillStyle = "black";
ctx.font = "bold 50px Arial"; // Set Font

// Create Player (Bomb)
function GameObjectPlayer()
{
	// Sprite
	this.playerSpritesheet = new Image();
	
	// Health
	this.playerCurrentHP = 3;
	// Locked Score + Multiplier
	this.playerLockedScore = 0;
	this.playerMultiplier = 1;
	// Position / Location
	this.playerPosition = 0; // Set at Level Load
}

// Create Bouncing Ball (Enemy)
function GameObjectBall()
{
	
}

// Tiles
function GameObjectTile()
{
	// Colour
	this.tileColour = "Blue";
	// Walk Over Trigger
	this.tileWalkedOver = false;
	// Safe Space
	this.tileSafeSpace = false;
	// Destroyed Tile
	this.tileDestroyed = false;
	// Winning Square
	this.tileWin = false;
	// Locked Tile
	this.tileLocked = false;
	// Hiden Power-up
	this.tilePower = false;
}

// 					Make Objects
let playerBomb = new GameObjectPlayer();
let gameBalls = [];
let gameTiles = [];

// Set Levels
const levels = { Level1: "1", Level2: "2" };
let currentLevel = levels.Level1;
let levelLoaded = false;

// 					Variables
let enableDebug = false;
// Placing Tiles
const MAX_TILES = 105;
const TILE_SIZE = 90;
const offsetTile = 100;
const offsetTileBG = 5;

// 					Other Functions
// Add 98 Tiles
for (let i = 0; i < MAX_TILES; i++)
{
	gameTiles[i] = new GameObjectTile();
}

// Images
playerBomb.playerSpritesheet.src = "assets/img/playerPlaceholder.png"
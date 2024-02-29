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
	
	// Path Size
	this.playerSnakeSize = 2;
	
	// Invis Circle
	this.playerPoint = 0;
	this.playerRadius = 45;
}

// Create Bouncing Ball (Enemy)
function GameObjectBall()
{
	// Positions
	this.ballXPos = 10;
	this.ballYPos = gameCanvas.height / 2 - 10;
	// Collision
	this.ballCollision = false;
	// Direction
	this.ballDirection = "None";
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
	// Hidden Power-up
	this.tilePower = false;
	// Hidden Trap Tiles
	this.tileTrap = false;
}

// 					Make Objects
let playerBomb = new GameObjectPlayer();
let gameBalls = [];
let gameTiles = [];

// Game States
const gameStates = { MainMenu: "MainMenu", Gameplay: "Gameplay", GameOver: "GameOver", LevelWin: "LevelWin" };
let currentGameStatus = gameStates.MainMenu;

// Ball Directions
const ballDirections = { UpLeft: "UpLeft", UpRight: "UpRight", DownRight: "DownRight", DownLeft: "DownLeft" };
let applyDirection = "None";

// Set Levels
const levels = { Level1: "1", Level2: "2", Level3: "3", Level4: "4", Level5: "5", Level6: "6" };
let currentLevel = levels.Level1;
let levelLoaded = false;

// 					Variables
let enableDebug = false;
// Placing Tiles
const MAX_TILES = 105;
const TILE_SIZE = 90;
const offsetTile = 100;
const offsetTileBG = 5;
// Input
let playerInput = "";
// Burning Tiles
let pastTiles = [];
let firstMove = true;
let tileScore = 0;
let tileQuota = 0;
let quotaTrigger = false;
// Text
let textXOffset = 10;
let textYOffset = 50;
// Enemy Related
let multiIncrease = 0;
let enemySpawnIncrease = 180;
let textSpawnIncrease = 3;
let enemySpawnTimer = 300;
let ballSpawnTimer = 0;
let textSpawnBall = 5;
const BALL_RADIUS = 25;
// Power Ups / Traps
const POWER_UP_AMOUNT = 4;
const TRAP_AMOUNT = 1;
let powerUpMessage = "Example Message";
let displayPowerUpMessage = false;
let powerUpMessageTimer = 0;
let powerUpMessageExpire = 180;
let getMessagePosition = true;
let messageXPos = 0;
let messageYPos = 0;
let extraSpace = 0;
// Level Transition
const transitionSpeed = 30;
let transitionBoxWidth = 0;
let transitionBoxHeight = 10;
let transitionBoxY = gameCanvas.height/2-5;

let returnMainMenu = false;

// 					Other Functions
// Add 98 Tiles
for (let i = 0; i < MAX_TILES; i++)
{
	gameTiles[i] = new GameObjectTile();
}

// Images
playerBomb.playerSpritesheet.src = "assets/img/playerPlaceholder.png";




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
	this.playerCurrentHP = 6;
	// Locked Score + Multiplier
	this.playerLockedScore = 0;
	this.playerMultiplier = 1;
	// Position / Location
	this.playerPosition = 0; // Set at Level Load
	// Player Direction
	this.playerDirectionFace = "Down";
	
	// Path Size
	this.playerSnakeSize = 2;
	
	// Invis Circle
	this.playerPoint = 0;
	this.playerRadius = 45;
	
	// Playtime
	this.playerTime = 0;
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

// Create UFO (Enemy)
function GameObjectUFO()
{
	// Sprites
	this.ufoSpritesheet = new Image();
	this.ufoPreFireSprite = new Image();
	this.ufoFireSprite = new Image();
	// Poisitions
	this.ufoXPos = 0;
	// Direction
	this.ufoChangeDir = 0;
	this.ufoDirection = "Left";
	this.ufoFirstTime = true;
	// Fire Status
	this.ufoTimeBeforeFire = 99; // Anything but <=0
	this.ufoPreFire = false;
	this.ufoFire = false;
	this.ufoTimer = 0;
}

// Create Star (Invincibility)
function GameObjectStar()
{
	// Sprites
	this.starSpritesheet = new Image();
	// Poisitions
	this.star_Xpos = 0;
	this.star_Ypos = 0;
	// Collected Status
	this.b_isStarCollected = false; // Move offscreen when true
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
let gameUFO = new GameObjectUFO();
let gameStar = new GameObjectStar();
let gameTiles = [];

// Game States
const gameStates = { MainMenu: "MainMenu", Gameplay: "Gameplay", GameOver: "GameOver", LevelWin: "LevelWin" };
let currentGameStatus = gameStates.MainMenu;

// Ball Directions
const ballDirections = { UpLeft: "UpLeft", UpRight: "UpRight", DownRight: "DownRight", DownLeft: "DownLeft" };
let applyDirection = "None";

// Wall Tile States
let newWallState = [false, false, false];
let wallStateQuota = [0, 0, 0];

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
// Timer Next Level
let timerNextLevelCounter = 4;
let timerNextLevel = 0;
// Radio Timer
let radioTimer = 0;
let radioSelecter = -1;
// HUD Timer
let tcHUDCurrent1Xpos = 640;
let tcHUDCurrent2Xpos = 700;
let tcHUDSlashXPos = 740;
let tcHUDReq1Xpos = 800;
let tcHUDReq2Xpos = 860;
let tcSSWidth = 80;
let tcSS_0 = 0;
let tcSS_1 = 80;
let tcSS_2 = 160;
let tcSS_3 = 240;
let tcSS_4 = 320;
let tcSS_5 = 400;
let tcSS_6 = 480;
let tcSS_7 = 560;
let tcSS_8 = 640;
let tcSS_9 = 720;
// Title Screen Sound
let b_isTitleScreenSoundPlayed = false;


// Invincibility Collectible
let b_isIvincibilityOn = false;

let finalTime = 0;

let returnMainMenu = false;

// 					Other Functions
// Add 98 Tiles
for (let i = 0; i < MAX_TILES; i++)
{
	gameTiles[i] = new GameObjectTile();
}

globeAnimation = 0;
globeSSXPos = 0;
globeSSYPos = 0;
enemySSXPos = 0;
enemySSYPos = 0;
// Star Animation
starAnimation = 0;
starSSXPos = 0;
starSSYPos = 0;

wallSSXPos = 0;

rocketAnimation = 0;
rocketSSXPos = 0;
rocketSSYPos = 0;
snakeTileCount = 0;

playerAnimation = 0;
playerSSXPos = 0;
playerSSYPos = 0;
playerSwapYPos = false;

titleAnimation = 0;
titleSSYPos = 720;
titleCycle = 1;

// 							Images
// Tile Images
blueTileSprite = new Image();
blueTileSprite.src = "assets/img/BaseTile.png";
blackTileSprite = new Image();
blackTileSprite.src = "assets/img/Black_Tile.png";
powerUpTileSprite = new Image();
powerUpTileSprite.src = "assets/img/TileBonus.png";
safeTileSprite = new Image();
safeTileSprite.src = "assets/img/TileGrey.png";
trapTileSprite = new Image();
trapTileSprite.src = "assets/img/TileTrap.png";
wallTileSpritesheet = new Image();
wallTileSpritesheet.src = "assets/img/BarrierSpritesheet.png";
globeTileSpritesheet = new Image();
globeTileSpritesheet.src = "assets/img/EarthSpritesheet.png";
snakeTileSprite = new Image();
snakeTileSprite.src = "assets/img/SafetyGridOutline_Large.png";
spaceshipSpritesheet = new Image();
spaceshipSpritesheet.src = "assets/img/SpaceshipSpritesheet.png"; 
// Player + Enemy Spritesheets
enemySpritesheet = new Image();
enemySpritesheet.src = "assets/img/AsteroidSpritesheet.png"; 
enemySpritesheetInactive = new Image();
enemySpritesheetInactive.src = "assets/img/AsteroidSpritesheetInactive.png"; 
playerBomb.playerSpritesheet.src = "assets/img/AstronautSpritesheet.png"; 
gameUFO.ufoSpritesheet.src = "assets/img/UFOSpritesheet.png";
gameUFO.ufoPreFireSprite.src = "assets/img/Laser_Pre_Fire.png";
gameUFO.ufoFireSprite.src = "assets/img/Laser_Fire.png";
// Text
textSuccessSprite = new Image();
textSuccessSprite.src = "assets/img/Mission_Success.png";
textFailedSprite = new Image();
textFailedSprite.src = "assets/img/Mission_Failed.png";
controlSprite = new Image();
controlSprite.src = "assets/img/ControlsText.png";

// Particle
particleSprite = new Image();
particleSprite.src = "assets/img/ParticleSpritesheet.png"

titleSpritesheet = new Image();
titleSpritesheet.src = "assets/img/TitleSpritesheet.png";
thanksForPlayingTextSprite = new Image();
thanksForPlayingTextSprite.src = "assets/img/ThanksForPlayingText.png";
// Mis
thanksPlayingSprite = new Image();
thanksPlayingSprite.src = "assets/img/ThanksForPlaying.png";

// HUD
hudSprite = new Image();
hudSprite.src = "assets/img/HUD.png";
// HUD Lives
livesHUD1 = new Image();
livesHUD1.src = "assets/img/LiveHUD1.png";
livesHUD2 = new Image();
livesHUD2.src = "assets/img/LiveHUD2.png";
livesHUD3 = new Image();
livesHUD3.src = "assets/img/LiveHUD3.png";
livesHUD4 = new Image();
livesHUD4.src = "assets/img/LiveHUD4.png";
livesHUD5 = new Image();
livesHUD5.src = "assets/img/LiveHUD5.png";
livesHUD6 = new Image();
livesHUD6.src = "assets/img/LiveHUD6.png";
livesHUD7 = new Image();
livesHUD7.src = "assets/img/LiveHUD7.png";
// Gold Lives
livesHUD8 = new Image();
livesHUD8.src = "assets/img/LiveHUD8.png";
livesHUD9 = new Image();
livesHUD9.src = "assets/img/LiveHUD9.png";
livesHUD10 = new Image();
livesHUD10.src = "assets/img/LiveHUD10.png";
livesHUD11 = new Image();
livesHUD11.src = "assets/img/LiveHUD11.png";
livesHUD12 = new Image();
livesHUD12.src = "assets/img/LiveHUD12.png";
livesHUD13 = new Image();
livesHUD13.src = "assets/img/LiveHUD13.png";
livesHUD14 = new Image();
livesHUD14.src = "assets/img/LiveHUD14.png";
// Enemy Spawner
esIcon6 = new Image();
esIcon6.src = "assets/img/EnemySpawnerHUDPlus.png";
esIcon5 = new Image();
esIcon5.src = "assets/img/EnemySpawnerHUD5.png";
esIcon4 = new Image();
esIcon4.src = "assets/img/EnemySpawnerHUD4.png";
esIcon3 = new Image();
esIcon3.src = "assets/img/EnemySpawnerHUD3.png";
esIcon2 = new Image();
esIcon2.src = "assets/img/EnemySpawnerHUD2.png";
esIcon1 = new Image();
esIcon1.src = "assets/img/EnemySpawnerHUD1.png";
// TileCount
tcHUDCurrent = new Image();
tcHUDCurrent.src = "assets/img/tcHUD.png";
tcHUDRequired = new Image();
tcHUDRequired.src = "assets/img/tcHUDRequired.png";
tcHUDHighlight = new Image();
tcHUDHighlight.src = "assets/img/tcHUDHighlight.png";
tcHUDSlash = new Image();
tcHUDSlash.src = "assets/img/tcHUDSlash.png";

// Badges
pilotBadge = new Image();
pilotBadge.src = "assets/img/PilotBadge.png";
commanderBadge = new Image();
commanderBadge.src = "assets/img/CommanderBadge.png";
specialistBadge = new Image();
specialistBadge.src = "assets/img/SpecialistBadge.png";
masterBadge = new Image();
masterBadge.src = "assets/img/MasterBadge.png";

// Star
starSpritesheet = new Image();
starSpritesheet.src = "assets/img/StarSpritesheet.png";

// SFX
let deathSound = new Audio("assets/audio/DeathSound.wav");
let woohooSound = new Audio("assets/audio/woohooSound.wav"); // Plays when clearing a level
let tileCollectSound = new Audio("assets/audio/TileFlipSound.wav");
let tilesReqSound = new Audio("assets/audio/TileRequired.wav");
tilesReqSound.loop = false;
let powerUpSound = new Audio("assets/audio/Powerup.wav");
let trapSound = new Audio("assets/audio/TrapTileSound.wav");
let asteroidHitSound = new Audio("assets/audio/ExplosionSound.wav");
let crowdLoseSound = new Audio("assets/audio/CrowdLoseSound.wav"); // Plays when run out of lives 	
crowdLoseSound.volume = 0.1;		
let crowdWinSound = new Audio("assets/audio/CrowdCheerSound.wav"); // Plays when beat last level 
crowdWinSound.volume = 0.1;			
let levelStartSound = new Audio("assets/audio/RadioSound.wav"); // Play on Mission Failed screen OR player respawn???
let splashScreenSound = new Audio("assets/audio/ExitLevelComplete.wav");
splashScreenSound.loop = false;
let countdownSound = new Audio("assets/audio/Countdown.wav"); // Plays before new gameplus
countdownSound.loop = false;					
let barrierBreak1Sound = new Audio("assets/audio/BarrierBreak1.wav"); 		
barrierBreak1Sound.volume = 0.03;								
let barrierBreak2Sound = new Audio("assets/audio/BarrierBreak2.wav"); 	
barrierBreak2Sound.volume = 0.1;									

let missionSuccessSound = new Audio("assets/audio/MissionSuccessSound.wav"); 						
missionSuccessSound.volume = 0.7;
// Radio
/*
let radio2Sound = new Audio("assets/audio/RadioSound2.wav"); 												// NOT IN
let radio3Sound = new Audio("assets/audio/RadioSound3.wav"); 												// NOT IN
let radio4Sound = new Audio("assets/audio/RadioSound4.wav"); 												// NOT IN
let radio5Sound = new Audio("assets/audio/RadioSound5.wav"); 												// NOT IN
*/
// Laser
let laserPreFireSound = new Audio("assets/audio/Pre_Fire_Laser.wav"); 
let laserFireSound = new Audio("assets/audio/Laser_Fire.wav"); 
let laserEvaporateSound = new Audio("assets/audio/Laser_Evaporate.wav"); 


// Music
let gameMusic = new Audio("assets/audio/Eric Skiff - Underclocked (underunderclocked mix).mp3");
gameMusic.volume = 0.4;
gameMusic.loop = true;
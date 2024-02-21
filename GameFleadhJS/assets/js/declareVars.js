console.log("declareVars.js Running");

// Create Canvas
let gameCanvas = document.getElementById("gameCanvas");
gameCanvas.style.display = "block";
let ctx = gameCanvas.getContext("2d");
ctx.font = "bold 50px Arial"; // Set Font

// Create Player (Square + Player Data)
function GameObjectPlayer()
{
	// Health
	this.playerCurrentHP = 3;
	// Locked Score + Unlocked Score + Multiplier
	this.playerLockedScore = 0;
	this.playerUnlockedScore = 0;
	this.playerMultiplier = 1;
}

// Create Bouncing Ball
function GameObjectBall()
{
	
}

// Create Breakable Blocks
function GameObjectBlock()
{
	
}

// Make Objects
let playerSquare = new GameObjectPlayer();
let gameBalls = [];
let gameBlocks = [];
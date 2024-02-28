console.log("main.js Running");

// Game Update 
function update()
{
	switch (currentGameStatus)
	{
	case gameStates.MainMenu:
		break;
	case gameStates.Gameplay:
	
		// Debug
		if (enableDebug)
		{
		}
	
		// Update the Tile the Player walks Over
		if (playerInput == "Up" || playerInput == "Down" || playerInput == "Left" || playerInput == "Right")
			updateCurrentTile();
		if (tileScore >= tileQuota && quotaTrigger == false)
		{
			unlockTiles();
			quotaTrigger = true;
		}
		
		// Timer for Balls
		if (ballSpawnTimer >= enemySpawnTimer + (enemySpawnIncrease * multiIncrease))
		{
			// Spawn New Ball
			gameBalls[gameBalls.length] = new GameObjectBall();
			let newPos = Math.floor(Math.random() * 1000);
			newPos+=10;
			gameBalls[gameBalls.length-1].ballXPos = newPos;
			let newDir = Math.floor(Math.random() * 4);
			switch (newDir)
			{
			case 0:
				newDir = ballDirections.UpLeft
				break;
			case 1:
				newDir = ballDirections.UpRight;
				break;
			case 2:
				newDir = ballDirections.DownRight;
				break;
			case 3:
				newDir = ballDirections.DownLeft;
				break;
			}
			gameBalls[gameBalls.length-1].ballDirection = newDir;
			
			// Give Collision to Next Ball
			if (gameBalls.length >= 2)
				gameBalls[gameBalls.length-2].ballCollision = true;
			
			// Reset Timer and Text
			ballSpawnTimer = 0;
			textSpawnBall = 5 + (textSpawnIncrease * multiIncrease);
		}
		else
		{
			ballSpawnTimer++;
			if (ballSpawnTimer % 60 == 0)
				textSpawnBall--;
		}
		
		// Move Balls
		if (gameBalls.length > 0)
		{
			for (let i = 0; i < gameBalls.length; i++)
			{
				switch(gameBalls[i].ballDirection)
				{
				case ballDirections.UpLeft:
					gameBalls[i].ballXPos--;
					gameBalls[i].ballYPos--;
					break;
				case ballDirections.UpRight:
					gameBalls[i].ballXPos++;
					gameBalls[i].ballYPos--;
					break;
				case ballDirections.DownRight:
					gameBalls[i].ballXPos++;
					gameBalls[i].ballYPos++;
					break;
				case ballDirections.DownLeft:
					gameBalls[i].ballXPos--;
					gameBalls[i].ballYPos++;
					break;
				}
				
				// OOB Check for Canvas
				if (gameBalls[i].ballXPos <= BALL_RADIUS || gameBalls[i].ballXPos >= gameCanvas.width - BALL_RADIUS
					|| gameBalls[i].ballYPos <= BALL_RADIUS || gameBalls[i].ballYPos >= gameCanvas.height - BALL_RADIUS)
				{
					// Check if Top / Bottom / Left / Right
					if (gameBalls[i].ballYPos <= BALL_RADIUS) // Top
					{
						// Change Direction
						if (gameBalls[i].ballDirection == ballDirections.UpRight)
							gameBalls[i].ballDirection = ballDirections.DownRight; // Down Right
						else
							gameBalls[i].ballDirection = ballDirections.DownLeft; // Down Left
					}
					else if (gameBalls[i].ballYPos >= gameCanvas.height - BALL_RADIUS) // Bottom
					{
						// Change Direction
						if (gameBalls[i].ballDirection == ballDirections.DownRight)
							gameBalls[i].ballDirection = ballDirections.UpRight; // Up Right
						else
							gameBalls[i].ballDirection = ballDirections.UpLeft; // Up Left
					}
					else if (gameBalls[i].ballXPos <= BALL_RADIUS) // Left
					{
						// Change Direction
						if (gameBalls[i].ballDirection == ballDirections.UpLeft)
							gameBalls[i].ballDirection = ballDirections.UpRight; // Up Right
						else
							gameBalls[i].ballDirection = ballDirections.DownRight; // Down Right
					}
					else // Right
					{
						// Change Direction
						if (gameBalls[i].ballDirection == ballDirections.DownRight)
							gameBalls[i].ballDirection = ballDirections.DownLeft; // Down Left
						else
							gameBalls[i].ballDirection = ballDirections.UpLeft; // Up Left
					}
				}
			}
		}
		
		// Player Collision with Ball
		if (gameBalls.length >= 2)
		{
			for (let i = 0; i < gameBalls.length - 1; i++)
			{
				if (ballCollisionCheck(i))
				{
					console.log("ball hit");
					currentGameStatus = gameStates.GameOver; // Change Game State to GameOver
					break;
				}
			}
		}
		
		break;
	case gameStates.GameOver:
		break;
	}
}

// Game Draw
function draw()
{
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear Canvas
	
	
	if (currentGameStatus == gameStates.MainMenu)
	{
		
	}
	else if (currentGameStatus == gameStates.Gameplay || currentGameStatus == gameStates.LevelWin || currentGameStatus == gameStates.GameOver)
	{
		// Draw Basic Tile Arena
		ctx.fillStyle = "black";
		ctx.fillRect(offsetTile, offsetTile, gameCanvas.width - offsetTile * 2 + 30, gameCanvas.height - offsetTile * 2 - 30); // Black Background
		// Coloured Spaces
		let xPos = 0;
		let yPos = 0;
		for (let i = 0; i < MAX_TILES; i++)
		{
			ctx.fillStyle = gameTiles[i].tileColour;
	
			ctx.fillRect(offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
			xPos++;
			if (xPos == 15)
			{
				xPos = 0;
				yPos++;
			}
		}
		if (levelLoaded == false)
			makeLevelLayout(); // Edit basic level to make current level
		
		// Draw Balls 
		if (gameBalls.length > 0)
		{
			for (let i = 0; i < gameBalls.length; i++)
			{
				ctx.beginPath();
				if (gameBalls[i].ballCollision == false)
					ctx.fillStyle = "pink";
				else
					ctx.fillStyle = "orange";
				ctx.arc(gameBalls[i].ballXPos, gameBalls[i].ballYPos, BALL_RADIUS, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	
		// Draw Player
		yPos = 1;
		while (playerBomb.playerPosition >= 15 * yPos)
			yPos++;
		yPos--;
		//yPos
		xPos = playerBomb.playerPosition - 15 * yPos;
		drawFrame(playerBomb.playerSpritesheet, 0, 0, TILE_SIZE, TILE_SIZE, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE); 

		// Boxes for UI
		ctx.fillStyle = "gray";
		ctx.roundRect(-50,-50,550,130,50);
		ctx.roundRect(580,-50,340,130,50);
		ctx.roundRect(1150,-50,700,130,50);
		ctx.fill();
		
		// Text
		ctx.fillStyle = "White";
		ctx.fillText("Lives Remaining: " + playerBomb.playerCurrentHP, 10, 50);
		ctx.fillText("Points: " + tileScore + "/" + tileQuota, textXOffset + 600, textYOffset);
		ctx.fillText("Enemy Timer: " + textSpawnBall, textXOffset + 1200, textYOffset);

		// Debug
		if (enableDebug)
		{
			// Player Hitbox
			yPos = 1;
				while (playerBomb.playerPosition >= 15 * yPos)
				yPos++;
			yPos--;
			xPos = playerBomb.playerPosition - 15 * yPos;
			ctx.arc(offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * xPos), offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * yPos), playerBomb.playerRadius, 0, 2 * Math.PI);
			ctx.fillStyle = "green";
			ctx.fill();
		}
		
		// Power Up Message
		if (displayPowerUpMessage == true)
		{
			ctx.fillStyle = "purple";
			
			if (getMessagePosition == true)
			{
				messageYPos = 1;
				while (playerBomb.playerPosition >= 15 * messageYPos)
					messageYPos++;
				messageYPos--;
				messageXPos = playerBomb.playerPosition - 15 * messageYPos - 2;
				powerUpMessageTimer = 0;
				if (messageXPos != -2 || messageXPos != 13 || messageXPos != 28 || messageXPos != 43 || messageXPos != 58 || messageXPos != 73 || messageXPos != 88)
					extraSpace = 50;
				getMessagePosition = false;
			}
			ctx.fillText(powerUpMessage, offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * messageXPos), offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * messageYPos) + extraSpace);
			
			powerUpMessageTimer++;
			if (powerUpMessageTimer >= powerUpMessageExpire)
			{
				displayPowerUpMessage = false;
				getMessagePosition = true;
				powerUpMessageTimer = 0;
			}
		}
		
		// Overlay Extra Information
		if (currentGameStatus == gameStates.LevelWin || currentGameStatus == gameStates.GameOver)
		{
			ctx.fillStyle = "rgba(1, 0, 0, 0.7)";
			// Display Win Message Over Game
			if (transitionBoxWidth < gameCanvas.width - 20)
			{
				transitionBoxWidth+=transitionSpeed;
				if (transitionBoxWidth > gameCanvas.width - 20)
					transitionBoxWidth = gameCanvas.width - 20;
			}
			else if (transitionBoxWidth == gameCanvas.width - 20 && transitionBoxHeight < gameCanvas.height - 60)
			{
				transitionBoxY-=transitionSpeed;
				transitionBoxHeight+=transitionSpeed*2;
			}
			ctx.fillRect(10, transitionBoxY, transitionBoxWidth, transitionBoxHeight); // Draw Box (10)
			if (currentGameStatus == gameStates.LevelWin)
			{
				ctx.fillText("Win Screen", 0, 100);
			}
			// Display Game Over Message
			else 
			{
				ctx.fillText("Game Over Screen", 0, 100);
			}
		}
	}
}

function gameLoop()
{
	update();
	draw();
	window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

// Event Listeners
//window.addEventListener("keydown", input);
window.addEventListener("keyup", input);
//window.addEventListener("mousedown", input);
//window.addEventListener("mouseup", input);
//window.addEventListener("mousemove", input);

function updateCurrentTile()
{
	// Check Current Tile
	// Undo Input 
	if (gameTiles[playerBomb.playerPosition].tileLocked == true)
	{
		switch(playerInput) // Inverse Direction
		{
		case "Up":
			playerBomb.playerPosition += 15;
			break;
		case "Down":
			playerBomb.playerPosition -= 15;
			break;
		case "Left":
			playerBomb.playerPosition++;
			break;
		case "Right":
			playerBomb.playerPosition--;
			break;
		}
	}
	// Lose Life
	else if (gameTiles[playerBomb.playerPosition].tileDestroyed == true)
	{
		currentGameStatus = gameStates.GameOver;
	}
	// Walked Over
	else if (gameTiles[playerBomb.playerPosition].tileWalkedOver == false && gameTiles[playerBomb.playerPosition].tileWin == false
				&& gameTiles[playerBomb.playerPosition].tileSafeSpace == false)
	{
		gameTiles[playerBomb.playerPosition].tileWalkedOver = true;
		gameTiles[playerBomb.playerPosition].tileColour = "Red";
		// Check if Array size Has Old Moves
		if (firstMove != true)
		{
			for (let i = playerBomb.playerSnakeSize; i > -1 ; i--)
			{
				pastTiles[i+1] = pastTiles[i];
			}
			pastTiles[0] = playerBomb.playerPosition;
		}
		else
		{
			pastTiles[0] = playerBomb.playerPosition;
			firstMove = false;
		}
		tileScore++; // Increase Score
		
		// Check if Walked Over Tile contains a Power Up
		if (gameTiles[playerBomb.playerPosition].tilePower == true)
		{
			let randPower = Math.floor(Math.random() * POWER_UP_AMOUNT);
			// Use Power Up
			switch (randPower) 
			{
			case 0: // Add Points
				powerAddPoints();
				break;
			case 1: // Add Life
				powerAddLife();
				break;
			case 2: // Increase Spawn Timer
				powerIncreaseEnemySpawnTimer();
				break;
			case 3: // Increase Player Path
				powerIncreaseSnakeSize();
				break;
			}
			// Power Up Message
			displayPowerUpMessage = true;
			getMessagePosition = true;
			gameTiles[playerBomb.playerPosition].tilePower = false; // Disable Power Up Tile
		}
		// Check if Walked Over Tile contains a Trap
		else if (gameTiles[playerBomb.playerPosition].tileTrap == true)
		{
			let randPower = Math.floor(Math.random() * TRAP_AMOUNT);
			// Use Trap
			switch (randPower)
			{
			case 0: // Lose Points
				trapLosePoints();
				break;
			}
			// Power Up Message
			displayPowerUpMessage = true;
			getMessagePosition = true;
			gameTiles[playerBomb.playerPosition].tileTrap = false; // Disable Trap Tile
		}
	}
	// Wining Tile
	else if (gameTiles[playerBomb.playerPosition].tileWin == true)
	{
		currentGameStatus = gameStates.LevelWin;
		firstMove = true;
	}
	
	// Turn Walked Over into Destroyed
	if (pastTiles[playerBomb.playerSnakeSize+1] != undefined)
	{
		let i = pastTiles.pop();
		gameTiles[i].tileDestroyed = true;
		gameTiles[i].tileColour = "Black";
	}
	playerInput = ""; // Reset Input
}

function unlockTiles()
{
	for (let i = 0; i < MAX_TILES; i++)
	{
		if (gameTiles[i].tileLocked == true)
		{
			gameTiles[i].tileLocked = false;
			gameTiles[i].tileColour = "Blue";
		}
	}
}

function ballCollisionCheck(i) // Very Janky ATM
{
	let collisionTrigger = false;
	
	let yPosCollision = 1;
	while (playerBomb.playerPosition >= 15 * yPosCollision)
		yPosCollision++;
	yPosCollision--;
	let xPosCollision = playerBomb.playerPosition - 15 * yPosCollision;
	
	// Get Points
	let playerPointX = offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * xPosCollision);
	let playerPointY = offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * yPosCollision);
	let ballPointX = gameBalls[i].ballXPos + BALL_RADIUS;
	let ballPointY = gameBalls[i].ballYPos + BALL_RADIUS;
	
	// Get Opp and Adj
	let oppX = playerPointX - ballPointX;
	if (oppX < 0)
		oppX = oppX * -1;
	let adjY = playerPointY - ballPointY;
	if (adjY < 0)
		adjY = adjY * -1;
	
	// Get Hyp
	let hyp = oppX * oppX + adjY * adjY;
	hyp = Math.sqrt(hyp);
	
	if (playerBomb.playerRadius + BALL_RADIUS >= hyp)
		collisionTrigger = true;

	return collisionTrigger;
}

function makeLevelLayout()
{
	// Set Everything to False / Default
	multiIncrease = 0;
	quotaTrigger = false;
	pastTiles.length = 0;
	tileScore = 0;
	playerBomb.playerSnakeSize = 2;
	ballSpawnTimer = 0;
	enemySpawnTimer = 300;
	gameBalls.length = 0;
	for (let i = 0; i < MAX_TILES; i++)
	{
		gameTiles[i].tileColour = "Blue";
		gameTiles[i].tileWalkedOver = false;
		gameTiles[i].tileSafeSpace = false;
		gameTiles[i].tileDestroyed = false;
		gameTiles[i].tileWin = false;
		gameTiles[i].tileLocked = false;
		gameTiles[i].tilePower = false;
	}
	
	// Example Level
	/*
		// Set Player Position
		playerBomb.playerPosition = 48;
		// Safe Tiles
		gameTiles[48].tileSafeSpace = true;
		// Win Tile
		gameTiles[53].tileWin = true;
		// Disable Tiles
		for (let i = 22; i < 28; i++)
			gameTiles[i].tileDestroyed = true;
		gameTiles[37].tileDestroyed = true;
		gameTiles[52].tileDestroyed = true;
		gameTiles[56].tileDestroyed = true;
		gameTiles[67].tileDestroyed = true;
		for (let i = 82; i < 88; i++)
			gameTiles[i].tileDestroyed = true;
		// Locked Tiles
		gameTiles[39].tileLocked = true;
		gameTiles[54].tileLocked = true;
		gameTiles[69].tileLocked = true;
		// Power Up Tiles
		gameTiles[50].tilePower = true;
		// Trap Tiles
		gameTiles[46].tileTrap = true;
	*/
	
	switch (currentLevel)
	{
	case levels.Level1: // Level 1
	
		tileQuota = 6; // Set Level Quota (6)
	
		// Set Player Position
		playerBomb.playerPosition = 63;
		// Safe Tiles
		gameTiles[63].tileSafeSpace = true;
		// Win Tiles
		gameTiles[71].tileWin = true;
		// Disable Tiles
		for (let i = 0; i < MAX_TILES; i++)
		{
			if (i < 63 || i > 71)
				gameTiles[i].tileDestroyed = true;
		}
		// Locked Tiles
		gameTiles[70].tileLocked = true;
		// No Power Ups
		// No Trap Tiles
		
		break;
	case levels.Level2: // Level 2
	
		tileQuota = 12; // Set Level Quota (12)
		
		// Set Player Position
		playerBomb.playerPosition = 46;
		// Safe Tiles
		gameTiles[5].tileSafeSpace = true;
		gameTiles[10].tileSafeSpace = true;
		gameTiles[95].tileSafeSpace = true;
		gameTiles[100].tileSafeSpace = true;
		for (let i = 30; i < 75; i++)
		{
			if (i < 33 || (i >= 42 && i <= 44) || (i >= 45 && i <= 47) 
				|| (i >= 60 && i <= 62) || (i >= 72 && i <= 74) || i == 57 || i == 59)
				gameTiles[i].tileSafeSpace = true;
		}
		// Win Tiles
		gameTiles[58].tileWin = true;
		// Disable Tiles
		for (let i = 0; i < MAX_TILES; i++)
		{
			if (i < 5 || (i >= 11 && i <= 19) || (i >= 21 && i <= 24) || (i >= 26 && i <= 29) || i == 33 || i == 34
				|| (i >= 36 && i <= 39) || i == 41 || (i >= 51 && i <= 54) || i == 63 || i == 64 || (i >= 66 && i <= 69) || i == 71 || (i >= 75 && i <= 79)
				|| (i >= 81 && i <= 84) || (i >= 86 && i <= 94) || i > 100)
				gameTiles[i].tileDestroyed = true;
		}
		// Locked Tiles
		gameTiles[56].tileLocked = true;
		// Power Up Tiles
		gameTiles[50].tilePower = true;
		gameTiles[55].tilePower = true;
		// No Trap Tiles
	
		break;
	case levels.Level3: // Level 3 (NOT COMPLETED)
	
		tileQuota = 20; // Set Level Quota (20)
		
		// Set Player Position
		playerBomb.playerPosition = 67;
		// Safe Tiles
		gameTiles[15].tileSafeSpace = true;
		gameTiles[29].tileSafeSpace = true;
		gameTiles[52].tileSafeSpace = true;
		gameTiles[90].tileSafeSpace = true;
		gameTiles[104].tileSafeSpace = true;
		for (let i = 66; i < 69; i++)
			gameTiles[i].tileSafeSpace = true;
		// Win Tiles
		gameTiles[97].tileWin = true;
		// Disable Tiles
		for (let i = 0; i < MAX_TILES; i++)
		{
			if (i < 6 || (i >= 9 && i <=14) || (i >= 31 && i <= 43) || (i >= 47 && i <= 49) || (i >= 55 && i <= 57) || (i >= 62 && i <= 64) || (i >= 70 && i <= 72)
				|| (i >= 76 && i <= 79) || (i >= 85 && i <= 88))
				gameTiles[i].tileDestroyed = true;
		}
		// Locked Tiles
		for (let i = 81; i < 84; i++)
			gameTiles[i].tileLocked = true;
		gameTiles[96].tileLocked = true;
		gameTiles[98].tileLocked = true;
		// Power Up Tiles
		gameTiles[50].tilePower = true;
		gameTiles[54].tilePower = true;
		// Trap Tiles
		gameTiles[22].tileTrap = true;
		gameTiles[45].tileTrap = true;
		gameTiles[59].tileTrap = true;
		gameTiles[60].tileTrap = true;
		gameTiles[74].tileTrap = true;
		
		
		break;
	case levels.Level4: // Level 4
	
		tileQuota = 30; // Set Level Quota (30)
		
		// Set Player Position
		playerBomb.playerPosition = 91;
		// Safe Tiles
		for (let i = 43; i < 93; i++)
		{
			if (i == 43 || (i >= 75 && i <= 77) || (i >= 90 && i <= 92))
				gameTiles[i].tileSafeSpace = true;
		}
		// Win Tiles
		gameTiles[13].tileWin = true;
		// Disable Tiles
		for (let i = 0; i < MAX_TILES; i++)
		{
			if (i < 6 || (i >= 7 && i <= 11) || (i >= 15 && i <= 18) || i == 22 || i == 26 || i == 32 || i == 33 || i == 35 || i == 37 || i == 39 || i == 41 || i == 42 || i == 44 || (i >= 46 && i <= 48)
				|| i == 50 || i == 52 || i == 54 || i == 56 || i == 57 || i == 59 || i == 65 || i == 69 || i == 71 || i == 72 || i == 74 || i == 78 || (i >= 80 && i <= 82) || i == 84 || i == 86 || i == 87
				|| i == 89 || i == 93 || i == 99)
				gameTiles[i].tileDestroyed = true;
		}
		// Locked Tiles
		for (let i = 27; i < 30; i++)
			gameTiles[i].tileLocked = true;
		// Power Up Tiles
		gameTiles[6].tilePower = true;
		gameTiles[31].tilePower = true;
		gameTiles[98].tilePower = true;
		gameTiles[104].tilePower = true;
		// Trap Tiles
		for (let i = 67; i < 98; i++)
		{
			if (i == 67 || i == 79 || (i >= 94 && i <= 97))
				gameTiles[i].tileTrap = true;
		}
		
		break;
	case levels.Level5: // Level 5
	
		// Set Level Quota ()
		
		// Set Player Position
		// Safe Tiles
		// Win Tiles
		// Disable Tiles
		// Locked Tiles
		// Power Up Tiles
		// Trap Tiles
		
		break;
	case levels.Level6: // Level 6
	
		// Set Level Quota ()
		
		// Set Player Position
		// Safe Tiles
		// Win Tiles
		// Disable Tiles
		// Locked Tiles
		// Power Up Tiles
		// Trap Tiles
		
		break;
	}
	// Recheck Tiles
	let xPos = 0;
	let yPos = 0;
	for (let i = 0; i < MAX_TILES; i++)
	{
		let remake = 0;
		if (gameTiles[i].tileSafeSpace == true)
			remake = 1;
		else if (gameTiles[i].tileWin == true)
			remake = 2;
		else if (gameTiles[i].tileDestroyed == true)
			remake = 3;
		else if (gameTiles[i].tileLocked == true)
			remake = 4;
		else if (gameTiles[i].tilePower == true)
			remake = 5;
		else if (gameTiles[i].tileTrap == true)
			remake = 6;
		// Check if need to Remade
		if (remake != 0)
		{
			switch(remake)
			{
			case 1:
				gameTiles[i].tileColour = "Gray";
				break;
			case 2:
				gameTiles[i].tileColour = "Yellow";
				break;
			case 3:
				gameTiles[i].tileColour = "Black";
				break;
			case 4:
				gameTiles[i].tileColour = "Brown";
				break;
			case 5:
				gameTiles[i].tileColour = "lime";
				break;
			case 6:
				gameTiles[i].tileColour = "orange";
				break;
			}
		}
	}
	levelLoaded = true;
}

function drawFrame(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight) {
	ctx.drawImage(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight);
}

function restartLevel()
{
	playerBomb.playerCurrentHP--;
	firstMove = false;
	levelLoaded = false; // Re-load Level / Restart
	gameBalls.length = 0;
	// Reset Timer and Text
	ballSpawnTimer = 0;
	textSpawnBall = 5;
	for (let i = playerBomb.playerSnakeSize; i > -1; i--)
		pastTiles[i] = undefined;
	tileScore = 0; // Reset Score
}

// =========================================== Power Up / Trap Functions ======================================================

function powerAddPoints()
{
	tileScore+=4; // Have to add 4 since the player always gets +1
	powerUpMessage = "+5 Points!"
}

function powerAddLife()
{
	playerBomb.playerCurrentHP++;
	powerUpMessage = "Extra Life!";
}

function powerIncreaseEnemySpawnTimer()
{
	multiIncrease++;
	textSpawnBall+= (textSpawnIncrease * multiIncrease);
	powerUpMessage = "Longer Enemy Spawn!";
}

function powerIncreaseSnakeSize()
{
	playerBomb.playerSnakeSize++;
	powerUpMessage = "Extra Snake Tile!";
}

function trapLosePoints()
{
	tileScore-=4; // Have to deduct 4 since the player always gains +1
	powerUpMessage = "-3 Points.";
}
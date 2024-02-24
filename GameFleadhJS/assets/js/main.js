console.log("main.js Running");

// Game Update 
function update()
{
	switch (currentGameStatus)
	{
	case gameStates.MainMenu:
		break;
	case gameStates.Gameplay:
		// Update the Tile the Player walks Over
		if (playerInput == "Up" || playerInput == "Down" || playerInput == "Left" || playerInput == "Right")
			updateCurrentTile();
		if (tileScore == tileQuota)
			unlockTiles();
		
		// Timer for Balls
		if (ballSpawnTimer >= TIME_FOR_SPAWN)
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
			
			// Reset Timer and Text
			ballSpawnTimer = 0;
			textSpawnBall = 5;
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
	
	switch (currentGameStatus)
	{
	case gameStates.MainMenu:
		break;
	case gameStates.Gameplay:
	
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
				ctx.arc(gameBalls[i].ballXPos, gameBalls[i].ballYPos, BALL_RADIUS, 0, 2 * Math.PI);
				ctx.fillStyle = "pink";
				ctx.fill();
			}
		}
	
		// Draw Player
		yPos = 1;
		while (playerBomb.playerPosition >= 15 * yPos)
			yPos++;
		yPos--;
		yPos
		xPos = playerBomb.playerPosition - 15 * yPos;
		drawFrame(playerBomb.playerSpritesheet, 0, 0, TILE_SIZE, TILE_SIZE, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE); 


		// Text
		ctx.fillStyle = "White";
		ctx.fillText("Lives Remaining: " + playerBomb.playerCurrentHP, 10, 50);
		ctx.fillText("Points: " + tileScore + "/" + tileQuota, textXOffset + 600, textYOffset);
		ctx.fillText("Enemy Timer: " + textSpawnBall, textXOffset + 1100, textYOffset);
		//console.log("Timer: " + ballSpawnTimer%60);

		break;
	case gameStates.GameOver:
		break;
	case gameStates.LevelWin:
		break;
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
		playerBomb.playerCurrentHP--;
		firstMove = false;
		levelLoaded = false; // Re-load Level / Restart
		for (let i = 0; i < gameBalls.length + 1; i++)
			gameBalls.pop();
		// Reset Timer and Text
		ballSpawnTimer = 0;
		textSpawnBall = 5;
		for (let i = 2; i > -1; i--)
			pastTiles[i] = undefined;
		tileScore = 0; // Reset Score
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
			for (let i = 2; i > -1 ; i--)
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
	}
	// Wining Tile
	else if (gameTiles[playerBomb.playerPosition].tileWin == true)
	{
		currentGameStatus = gameStates.LevelWin;
		firstMove = true;
	}
	
	// Turn Walked Over into Destroyed
	if (pastTiles[3] != undefined)
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

function makeLevelLayout()
{
	// Set Everything to False
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
	
	switch (currentLevel)
	{
	case levels.Level1: // Level 1
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
		break;
	case levels.Level2:
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
			}
		}
	}
	levelLoaded = true;
}

function drawFrame(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight) {
	ctx.drawImage(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight);
}
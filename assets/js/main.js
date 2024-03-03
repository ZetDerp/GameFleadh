console.log("main.js Running");

// Game Update 
function update()
{
	switch (currentGameStatus)
	{
	case gameStates.MainMenu:
		// Title Animation
		if (titleAnimation >= 15)
		{
			titleSSYPos+= 256 * titleCycle;
			if (titleSSYPos < 0 || titleSSYPos >= 2256)
			{
				if (titleCycle == 1)
					titleCycle = -1;
				else
					titleCycle = 1;
			}
			titleAnimation = 0;
		}
		else
			titleAnimation++;
		break;
	case gameStates.Gameplay:
	
		// Player Playtime
		playerBomb.playerTime++;
	
		// Update the Tile the Player walks Over
		if (playerInput == "Up" || playerInput == "Down" || playerInput == "Left" || playerInput == "Right")
			updateCurrentTile();
		if (tileScore >= tileQuota && quotaTrigger == false)
		{
			unlockTiles();
			quotaTrigger = true;
			tilesReqSound.play();				// Sound
		}
		
		// Update Wall Sprite
		if (tileScore >= wallStateQuota[0] && !newWallState[0])
		{
			wallSSXPos += 90
			newWallState[0] = true;
		}
		else if (tileScore >= wallStateQuota[1] && !newWallState[1])
		{
			wallSSXPos += 90;
			newWallState[1] = true;
		}
		else if (tileScore >= wallStateQuota[2] && !newWallState[2])
		{
			wallSSXPos += 90;
			newWallState[2] = true;
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
					asteroidHitSound.play();				// Sound
					console.log("ball hit");
					currentGameStatus = gameStates.GameOver; // Change Game State to GameOver
					playerAnimation = 0; // Reset Cycle
					playerSSXPos = 0;
					playerSSYPos = 0;
					playerSwapYPos = false;
					break;
				}
			}
		}
		
		// Move UFO
		if (gameUFO.ufoPreFire == false && gameUFO.ufoFire == false)
		{
			switch (gameUFO.ufoDirection) {
			case "Left":
				gameUFO.ufoXPos-=4;
				break;
			case "Right":
				gameUFO.ufoXPos+=4;
				break;
			}
		}
		
		// UFO Countdown to Fire / Pre Fire
		if (gameUFO.ufoFire == true)
		{
			// Check for Collision
			if (ufoCollisionCheck())
			{
				laserEvaporateSound.play();				// Sound
				console.log("ufo hit");
				currentGameStatus = gameStates.GameOver; // Change Game State to GameOver
				playerAnimation = 0; // Reset Cycle
				playerSSXPos = 0;
				playerSSYPos = 0;
				playerSwapYPos = false;
			}
			
			if (gameUFO.ufoTimer <= 0)
				gameUFO.ufoFire = false;
			else
				gameUFO.ufoTimer--;
		}
		else if (gameUFO.ufoPreFire == true)
		{
			if (gameUFO.ufoTimer <= 0)
			{
				laserFireSound.play();				// Sound
				console.log("FIRE");
				gameUFO.ufoPreFire = false;
				gameUFO.ufoFire = true;
				gameUFO.ufoTimer = 120;
			}
			else
				gameUFO.ufoTimer--;
		}
		else if (gameUFO.ufoTimeBeforeFire <= 0)
		{
			laserPreFireSound.play();
			console.log("PRE-FIRE");
			gameUFO.ufoPreFire = true;
			gameUFO.ufoTimer = 180;
			gameUFO.ufoTimeBeforeFire = (Math.floor(Math.random() * 4) + 1) * 60; // Range: 1 - 5 Seconds
		}
		else
			gameUFO.ufoTimeBeforeFire--;
		
		// Update Animated Sprites
		if (globeAnimation >= 15) // Globe
		{
			globeSSXPos+=90;
			enemySSXPos+=50;
			if (globeSSXPos >= 270)
			{
				globeSSXPos = 0;
				globeSSYPos+=90;
				
				enemySSXPos = 0;
				enemySSYPos+=50;
			}
			if (globeSSYPos >= 180)
			{
				globeSSXPos = 0;
				globeSSYPos = 0;
				
				enemySSXPos = 0;
				enemySSYPos = 0;
			}
			globeAnimation = 0;
		}
		else
			globeAnimation++;
		if (rocketAnimation >= 15) // Rocket / UFO
		{
			rocketSSXPos+=90;
			if (rocketSSXPos >= 360)
			{
				rocketSSXPos = 0;
				rocketSSYPos+=90;
			}
			if (rocketSSYPos >= 180)
			{
				rocketSSXPos = 0;
				rocketSSYPos = 0;
			}
			
			// UFO Only
			if ((gameUFO.ufoChangeDir >= 4 || (gameUFO.ufoChangeDir >= 2 && gameUFO.ufoFirstTime == true)) && gameUFO.ufoPreFire == false && gameUFO.ufoFire == false)
			{
				switch (gameUFO.ufoDirection) {
				case "Right":
					gameUFO.ufoDirection = "Left";
					break;
				case "Left":
					gameUFO.ufoDirection = "Right";
					break;
				}
				if (gameUFO.ufoFirstTime == true)
					gameUFO.ufoFirstTime = false;
				gameUFO.ufoChangeDir = 0;
			}
			else
				gameUFO.ufoChangeDir++;
			
			rocketAnimation = 0;
		}
		else
			rocketAnimation++;
		
		if (playerAnimation >= 15) // Player / Astronaut
		{
			playerSSXPos+=90;
			switch (playerBomb.playerDirectionFace) {
			case "Up":
				playerSSYPos = 180;
				break;
			case "Down":
				playerSSYPos = 0;
				break;
			case "Left":
				playerSSYPos = 270;
				break;
			case "Right":
				playerSSYPos = 90;
				break;
			}
			if (playerSSXPos >= 360)
				playerSSXPos = 0;
			playerAnimation = 0;
		}
		else
			playerAnimation++;
		
		break;
	case gameStates.LevelWin:
		// Player Victory Animation
		if (playerAnimation >= 15)
		{
			playerSSYPos = 360;
			playerSSXPos+=90;
			if (playerSSXPos >= 360)
				playerSSXPos = 0;
			playerAnimation = 0;
		}
		else
			playerAnimation++;
		
		// Decay Timer
		if (timerNextLevel >= 60)
		{
			timerNextLevel = 0;
			timerNextLevelCounter--;
			if (timerNextLevelCounter == 0) // Start Next Level
			{
				timerNextLevelCounter = 4;
				
				switch (currentLevel)
				{
				case levels.Level1:
					currentLevel = levels.Level2;
					break;
				case levels.Level2:
					currentLevel = levels.Level3;
					break;
				case levels.Level3:
					currentLevel = levels.Level4;
					break;
				case levels.Level4:
					currentLevel = levels.Level5;
					break;
				case levels.Level5:
					currentLevel = levels.Level6;
					break;
				case levels.Level6:
					currentLevel = levels.Level1;
					currentGameStatus = gameStates.MainMenu;
					playerBomb.playerCurrentHP = 3;
					returnMainMenu = true;
					break;
				}
				transitionBoxWidth = 0;
				transitionBoxHeight = 10;
				transitionBoxY = gameCanvas.height/2-5;
				levelLoaded = false;
				if (returnMainMenu == false)
					currentGameStatus = gameStates.Gameplay;
				else
					returnMainMenu = false;
			}
		}
		else
			timerNextLevel++;
		
		
		break;
	case gameStates.GameOver:
		// Player Defeat Animation
		if (playerAnimation >= 15)
		{
			playerSSXPos+=90;
			if (playerSwapYPos == false)
			{
				playerSSYPos = 450;
				if (playerSSXPos >= 360)
				{
					playerSSXPos = 0;
					playerSSYPos+=90;
					playerSwapYPos = true;
				}
			}
			else if (playerSSXPos >= 360)
				playerSSXPos = 0;
			playerAnimation = 0;
		}
		else
			playerAnimation++;
		
		// Decay Timer
		if (timerNextLevel >= 60)
		{
			timerNextLevel = 0;
			timerNextLevelCounter--;
			if (timerNextLevelCounter == 0) // Start Next Level
			{
				timerNextLevelCounter = 4;
				if (playerBomb.playerCurrentHP - 1 <= 0)
				{
					currentGameStatus = gameStates.MainMenu;
					playerBomb.playerCurrentHP = 4; // +1 to account for restart
					currentLevel = levels.Level1;
					playerBomb.playerTime = 0;
				}
				else
					currentGameStatus = gameStates.Gameplay;
				transitionBoxWidth = 0;
				transitionBoxHeight = 10;
				transitionBoxY = gameCanvas.height/2-5;
				gameUFO.ufoTimer = 0;
				gameUFO.ufoFire = false;
				restartLevel();
			}
		}
		else
			timerNextLevel++;
		
		break;
	}

	// Radio Timer
	radioTimer--;
	if (radioTimer <= 0)
	{
		radioSelecter = randomRadioSelect(0,3);
	}
	// Radio Select
	if (radioSelecter == 0)
	{
		//radio2Sound.play();
		radioSelecter = -1; // Reset
	}
	else if (radioSelecter == 1)
	{
		//radio3Sound.play();
		radioSelecter = -1; // Reset
	}
	else if (radioSelecter == 2)
	{
		//radio4Sound.play();
		radioSelecter = -1; // Reset
	}
	else if (radioSelecter == 3)
	{
		//radio5Sound.play();
		radioSelecter = -1; // Reset
	}
}

// Game Draw
function draw()
{
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear Canvas
	
	if (currentGameStatus == gameStates.MainMenu)
	{
		// Title Animation
		drawFrame(titleSpritesheet, 0, titleSSYPos, 720, 256, 
						500, 300, 720, 256);
		ctx.fillStyle = "white";
		ctx.fillText("Press Space (or X) to Start", 550, 700);
	}
	else if (currentGameStatus == gameStates.Gameplay || currentGameStatus == gameStates.LevelWin || currentGameStatus == gameStates.GameOver)
	{
		// Draw Basic Tile Arena
		// Coloured Spaces
		if (levelLoaded == false)
			makeLevelLayout(); // Edit basic level to make current level
		let xPos = 0;
		let yPos = 0;
		for (let i = 0; i < MAX_TILES; i++)
		{
			ctx.fillStyle = gameTiles[i].tileColour;
			
			// Sprites
			switch (gameTiles[i].tileColour) {
			case "Blue":
				drawFrame(blueTileSprite, 0, 0, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			case "Black":
				break;
			case "Gray":
				drawFrame(safeTileSprite, 0, 0, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			case "Yellow":
				drawFrame(globeTileSpritesheet, globeSSXPos, globeSSYPos, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			case "Brown":
				drawFrame(wallTileSpritesheet, wallSSXPos, 0, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			case "Lime":
				drawFrame(powerUpTileSprite, 0, 0, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			case "Orange":
				drawFrame(trapTileSprite, 0, 0, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			case "Red":
				drawFrame(snakeTileSprite, 0, 0, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				if (snakeTileCount == 0 & pastTiles.length != 1)
				{
					drawFrame(spaceshipSpritesheet, rocketSSXPos, rocketSSYPos, 90, 90, 
						offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				}
				snakeTileCount++;
				break;
			default:
				// Basic Tile
				ctx.fillRect(offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
				break;
			}
			xPos++;
			if (xPos == 15)
			{
				xPos = 0;
				yPos++;
			}
		}
		snakeTileCount = 0;
		
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
				//ctx.arc(gameBalls[i].ballXPos + BALL_RADIUS, gameBalls[i].ballYPos + BALL_RADIUS, BALL_RADIUS, 0, 2 * Math.PI);
				drawFrame(enemySpritesheet, enemySSXPos, enemySSYPos, 50, 50, 
						gameBalls[i].ballXPos + BALL_RADIUS - 25, gameBalls[i].ballYPos + BALL_RADIUS - 25, 50, 50);
				ctx.fill();
			}
		}
		
		// Draw UFO Laser
		if (gameUFO.ufoFire == true)
			drawFrame(gameUFO.ufoFireSprite, 0, 0, 90, 900, 
				gameUFO.ufoXPos, -50, 90, 900);
		else if (gameUFO.ufoPreFire == true)
			drawFrame(gameUFO.ufoPreFireSprite, 0, 0, 90, 900, 
				gameUFO.ufoXPos, -50, 90, 900);
		// Draw UFO
		drawFrame(gameUFO.ufoSpritesheet, rocketSSXPos, rocketSSYPos, 90, 90, 
				gameUFO.ufoXPos, gameCanvas.height - 100, 90, 90);
	
		// Draw Player
		yPos = 1;
		while (playerBomb.playerPosition >= 15 * yPos)
			yPos++;
		yPos--;
		xPos = playerBomb.playerPosition - 15 * yPos;
			drawFrame(playerBomb.playerSpritesheet, playerSSXPos, playerSSYPos, 90, 90, 
					offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);

		// Draw new HUD
		drawFrame(hudSprite, 0, 0, 1600, 130, 0, 0, 1600, 130);
		if (playerBomb.playerCurrentHP >= 14){
			drawFrame(livesHUD14, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 13){
			drawFrame(livesHUD13, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 12){
			drawFrame(livesHUD12, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 11){
			drawFrame(livesHUD11, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 10){
			drawFrame(livesHUD10, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 9){
			drawFrame(livesHUD9, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 8){
			drawFrame(livesHUD8, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		if (playerBomb.playerCurrentHP == 7){
			drawFrame(livesHUD7, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		else if (playerBomb.playerCurrentHP == 6){
			drawFrame(livesHUD6, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		else if (playerBomb.playerCurrentHP == 5){
			drawFrame(livesHUD5, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		else if (playerBomb.playerCurrentHP == 4){
			drawFrame(livesHUD4, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		else if (playerBomb.playerCurrentHP == 3){
			drawFrame(livesHUD3, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		else if (playerBomb.playerCurrentHP == 2){
			drawFrame(livesHUD2, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}
		else if (playerBomb.playerCurrentHP == 1){
			drawFrame(livesHUD1, 0, 0, 1600, 130, 0, 0, 1600, 130);
		}

		// Enemy Spawner
		if (textSpawnBall >= 6){
			drawFrame(esIcon6, 0, 0, 450, 130, 1150, 0, 450, 130);
		}
		else if (textSpawnBall == 5){
			drawFrame(esIcon5, 0, 0, 450, 130, 1150, 0, 450, 130);
		}
		else if (textSpawnBall == 4){
			drawFrame(esIcon4, 0, 0, 450, 130, 1150, 0, 450, 130);
		}
		else if (textSpawnBall == 3){
			drawFrame(esIcon3, 0, 0, 450, 130, 1150, 0, 450, 130);
		}
		else if (textSpawnBall == 2){
			drawFrame(esIcon2, 0, 0, 450, 130, 1150, 0, 450, 130);
		}
		else if (textSpawnBall == 1){
			drawFrame(esIcon1, 0, 0, 450, 130, 1150, 0, 450, 130);
		}

		// HUD TileCount Current
		if (tileScore == 0){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 1){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 2){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 3){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 4){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 5){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 6){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 600, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 7){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 700, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 8){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 800, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 9){
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 900, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 10){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 11){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 12){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 13){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 14){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 15){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 16){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 600, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 17){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 700, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 18){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 800, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 19){
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 900, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 20){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 21){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 22){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 23){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 24){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 25){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 26){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 600, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 27){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 700, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 28){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 800, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 29){
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 900, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 30){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 31){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 32){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 33){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 34){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 35){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 36){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 600, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 37){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 700, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 38){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 800, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 39){
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 900, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 40){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 41){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 42){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 43){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 300, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 44){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 45){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 46){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 600, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 47){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 700, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 48){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 800, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 49){
			drawFrame(tcHUDCurrent, 400, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 900, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 50){
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 0, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 51){
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 100, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}
		else if (tileScore == 52){
			drawFrame(tcHUDCurrent, 500, 0, 100, 130, tcHUDCurrent1Xpos, 0, 100, 130);
			drawFrame(tcHUDCurrent, 200, 0, 100, 130, tcHUDCurrent2Xpos, 0, 100, 130);
		}

		// HUD Slash
		drawFrame(tcHUDSlash, 0, 0, 90, 130, 860, 0, 90, 130);

		// HUD TileCount Required
		if (tileQuota == 6){
			drawFrame(tcHUDRequired, 0, 0, 100, 130, tcHUDReq1Xpos, 0, 100, 130); // 0
			drawFrame(tcHUDRequired, 600, 0, 100, 130, tcHUDReq2Xpos, 0, 100, 130); // 6
		}
		else if (tileQuota == 12){
			drawFrame(tcHUDRequired, 100, 0, 100, 130, tcHUDReq1Xpos, 0, 100, 130); // 1
			drawFrame(tcHUDRequired, 200, 0, 100, 130, tcHUDReq2Xpos, 0, 100, 130); // 2
		}
		else if (tileQuota == 20){
			drawFrame(tcHUDRequired, 200, 0, 100, 130, tcHUDReq1Xpos, 0, 100, 130); // 2
			drawFrame(tcHUDRequired, 0, 0, 100, 130, tcHUDReq2Xpos, 0, 100, 130); // 0
		}
		else if (tileQuota == 10){
			drawFrame(tcHUDRequired, 100, 0, 100, 130, tcHUDReq1Xpos, 0, 100, 130); // 1
			drawFrame(tcHUDRequired, 0, 0, 100, 130, tcHUDReq2Xpos, 0, 100, 130); // 0
		}
		else if (tileQuota == 49){
			drawFrame(tcHUDRequired, 400, 0, 100, 130, tcHUDReq1Xpos, 0, 100, 130); // 4
			drawFrame(tcHUDRequired, 900, 0, 100, 130, tcHUDReq2Xpos, 0, 100, 130); // 9
		}

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
			if (getMessagePosition == true)
			{
				messageXPos = 50;
				messageYPos = gameCanvas.height - 50;
				powerUpMessageTimer = 0;
				getMessagePosition = false;
			}
			ctx.fillStyle = "gray";
			ctx.beginPath();
			ctx.roundRect(messageXPos - 20, messageYPos - 60, 600, 300, 50);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "white";
			ctx.fillText(powerUpMessage, messageXPos, messageYPos);
			
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
			ctx.fillStyle = "white";
			if (currentGameStatus == gameStates.LevelWin)
			{
				//ctx.fillText("Win Screen", 0, 100);
				if (!(transitionBoxHeight < gameCanvas.height - 60))
				{
					drawFrame(textSuccessSprite, 0, 0, 540, 180, 500, 250, 540, 180);
					ctx.fillText("Resuming In: " + timerNextLevelCounter, 550, 500);
					// Draw Animation
					drawFrame(playerBomb.playerSpritesheet, playerSSXPos, playerSSYPos, 90, 90, 
							350, 275, TILE_SIZE, TILE_SIZE);
					drawFrame(playerBomb.playerSpritesheet, playerSSXPos, playerSSYPos, 90, 90, 
							1100, 275, TILE_SIZE, TILE_SIZE);
					
					// Thank you Message + Rank
					if (currentLevel == levels.Level6)
					{
						// Thank you Message
						drawFrame(thanksPlayingSprite, 0, 0, 540, 540, 
							-100, 280, 540*1.5, 540*1.5);
						drawFrame(thanksForPlayingTextSprite, 0, 0, 540, 270, 
							550, 600, 540, 270);
						// Rank
						let finalTime = 0;
						while (playerBomb.playerTime >= 60)
						{
							finalTime++;
							playerBomb.playerTime-=60;
						}
						console.log("Completed in " + finalTime + " Seconds");
						// Final Times Taken (Seconds)
						// 36
						// 39 (GOLD)
						// 40 x3
						// 43 x2
						// 44 x2
						// 45 (SILVER)
						// 46
						// 50 (BRONZE)
						// 51
						// 53
						// 70
						// 77
						ctx.fillText("Time Ranks", 1200, 100);
						ctx.fillText("Time: " + finalTime + " Seconds", 1125, 150);
						drawFrame (pilotBadge, 0, 0, 300, 300,
							1250, 700, 300*.5, 300*.5); // Always Get
						if (finalTime < 50)
						{
							drawFrame (pilotBadge, 0, 0, 300, 300,
									1250, 525, 300*.5, 300*.5); // Third Rank
							if (finalTime < 45)
							{
								drawFrame (pilotBadge, 0, 0, 300, 300,
									1250, 350, 300*.5, 300*.5); // Second Rank
								if (finalTime < 40)
									drawFrame (pilotBadge, 0, 0, 300, 300,
										1250, 175, 300*.5, 300*.5); // First Rank
							}
						}
					} 
				}
			}
			// Display Game Over Message
			else 
			{
				//ctx.fillText("Game Over Screen", 0, 100);
				if (!(transitionBoxHeight < gameCanvas.height - 60))
				{
					drawFrame(textFailedSprite, 0, 0, 540, 180, 500, 250, 540, 180);
					ctx.fillText("Resuming In: " + timerNextLevelCounter, 550, 500);
					// Draw Animation
					drawFrame(playerBomb.playerSpritesheet, playerSSXPos, playerSSYPos, 90, 90, 
							350, 275, TILE_SIZE, TILE_SIZE);
					drawFrame(playerBomb.playerSpritesheet, playerSSXPos, playerSSYPos, 90, 90, 
							1100, 275, TILE_SIZE, TILE_SIZE);
				}
			}
		}
		
		//drawFrame(tcHUDRequired, 0, 0, 100, 130, tcHUDReq1Xpos, 0, 100, 130);
		//drawFrame(tcHUDRequired, 700, 0, 100, 130, tcHUDReq2Xpos, 0, 100, 130);
	
		// Particle display
		//drawFrame(particleSprite,  0, 0, 360, 180, playerBomb.playerPosition.xPos, playerBomb.playerPosition.yPos, 360, 180);

		//	350, 275, 90, 90);
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
		deathSound.play();						// Sound
		currentGameStatus = gameStates.GameOver;
		playerAnimation = 0; // Reset Cycle
		playerSSXPos = 0;
		playerSSYPos = 0;
		playerSwapYPos = false;
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
				pastTiles[i+1] = pastTiles[i];
			pastTiles[0] = playerBomb.playerPosition;
		}
		else
		{
			pastTiles[0] = playerBomb.playerPosition;
			firstMove = false;
		}
		tileScore++; // Increase Score
		tileCollectSound.play();								// Sound
		
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
		woohooSound.play();
		missionSuccessSound.play();
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

function ballCollisionCheck(i)
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

function ufoCollisionCheck()
{
	let collisionTrigger = false;
	
	let yPosCollision = 1;
	while (playerBomb.playerPosition >= 15 * yPosCollision)
		yPosCollision++;
	yPosCollision--;
	let xPosCollision = playerBomb.playerPosition - 15 * yPosCollision;
	
	// Get Positions
	let playerPointX = offsetTile + offsetTileBG + playerBomb.playerRadius + ((TILE_SIZE + offsetTileBG) * xPosCollision);
	let playerPointXRight = playerPointX + TILE_SIZE;
	let ufoPointXRight = gameUFO.ufoXPos + TILE_SIZE;
	
	if (playerPointXRight >= gameUFO.ufoXPos + 25 && playerPointX < ufoPointXRight + 25)
		collisionTrigger = true;
	return collisionTrigger;
}

function makeLevelLayout()
{
	gameMusic.play();
	// Set Everything to False / Default
	multiIncrease = 0;
	quotaTrigger = false;
	pastTiles.length = 0;
	tileScore = 0;
	playerBomb.playerSnakeSize = 2;
	ballSpawnTimer = 0;
	enemySpawnTimer = 300;
	gameBalls.length = 0;
	playerBomb.playerDirectionFace = "Down";
	for (let i = 0; i < newWallState.length; i++)
		newWallState[i] = false;
	wallSSXPos = 0;
	for (let i = 0; i < MAX_TILES; i++)
	{
		gameTiles[i].tileColour = "Blue";
		gameTiles[i].tileWalkedOver = false;
		gameTiles[i].tileSafeSpace = false;
		gameTiles[i].tileDestroyed = false;
		gameTiles[i].tileWin = false;
		gameTiles[i].tileLocked = false;
		gameTiles[i].tilePower = false;
		gameTiles[i].tileTrap = false;
	}
	gameUFO.ufoFirstTime = true;
	rocketAnimation = 0;
	gameUFO.ufoPreFire = false;
	gameUFO.ufoFire = false;
	gameUFO.ufoChangeDir = 0;
	gameUFO.ufoTimeBeforeFire = (Math.floor(Math.random() * 4) + 1) * 60; // Range: 1 - 5 Seconds
	textSpawnBall = 5;
	
	switch (currentLevel)
	{
	case levels.Level1: // Level 1
	
		tileQuota = 6; // Set Level Quota (6)
		
		// Wall States
		wallStateQuota[0] = 2;
		wallStateQuota[1] = 4;
		wallStateQuota[2] = 5;
	
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
		
		// Wall States
		wallStateQuota[0] = 3;
		wallStateQuota[1] = 6;
		wallStateQuota[2] = 9;
		
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
	case levels.Level3: // Level 3 
	
		tileQuota = 20; // Set Level Quota (20)
		
		// Wall States
		wallStateQuota[0] = 5;
		wallStateQuota[1] = 10;
		wallStateQuota[2] = 15;
		
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
	
		tileQuota = 20; // Set Level Quota (20)
		
		// Wall States
		wallStateQuota[0] = 5;
		wallStateQuota[1] = 10;
		wallStateQuota[2] = 15;
		
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
		gameTiles[30].tilePower = true;
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
	
		tileQuota = 10; // Set Level Quota (10)
		
		// Wall States
		wallStateQuota[0] = 2;
		wallStateQuota[1] = 6;
		wallStateQuota[2] = 8;
		
		// Set Player Position
		playerBomb.playerPosition = 82;
 
		// Safe Tiles
		for (let i = 81; i < 98; i++)
		{
			if (i <= 83 || i == 97)
				gameTiles[i].tileSafeSpace = true;
		}
		// Win Tiles
		gameTiles[52].tileWin = true;
		// No Disabled Tiles
		// Locked Tiles
		for (let i = 36; i < 69; i++)
		{
			if (i <= 38 || i == 51 || i == 53 || (i >= 66 && i <= 68))
				gameTiles[i].tileLocked = true;
		}
		// Power Up Tiles / Trap Tiles
		// for (let i = 0; i < MAX_TILES; i++)
		// {
		// 	if (!(i >= 6 && i <= 8) && !(i >= 21 && i <= 23) && !(i >= 36 && i <= 38) && !(i >= 51 && i <= 53)
		// 		&& !(i >= 66 && i <= 68) && !(i >= 81 && i <= 83) && !(i >= 96 && i <= 98))
		// 	{
		// 		if (i % 2 == 0) // Power Up Tiles
		// 			gameTiles[i].tilePower = true;
		// 		else // Trap Tiles
		// 			gameTiles[i].tileTrap = true;
		// 	} 
		// }

		// Row 1
		gameTiles[0].tilePower = true;
		gameTiles[1].tileTrap = true;
		gameTiles[2].tilePower = true;
		gameTiles[3].tileTrap = true;
		gameTiles[4].tilePower = true;
		gameTiles[5].tileSafeSpace = true;
		gameTiles[9].tileSafeSpace = true;
		gameTiles[10].tilePower = true;
		gameTiles[11].tileTrap = true;
		gameTiles[12].tilePower = true;
		gameTiles[13].tileTrap = true;
		gameTiles[14].tilePower = true;
		// Row 2
		gameTiles[15].tileTrap = true;
		gameTiles[16].tilePower = true;
		gameTiles[17].tileTrap = true;
		gameTiles[18].tilePower = true;
		gameTiles[19].tileTrap = true;
		gameTiles[20].tilePower = true;
		gameTiles[24].tilePower = true;
		gameTiles[25].tileTrap = true;
		gameTiles[26].tilePower = true;
		gameTiles[27].tileTrap = true;
		gameTiles[28].tilePower = true;
		gameTiles[29].tileTrap = true;
		// Row 3
		gameTiles[30].tilePower = true;
		gameTiles[31].tileTrap = true;
		gameTiles[32].tilePower = true;
		gameTiles[33].tileTrap = true;
		gameTiles[34].tilePower = true;
		gameTiles[35].tileTrap = true;

		gameTiles[39].tileTrap = true;
		gameTiles[40].tilePower = true;
		gameTiles[41].tileTrap = true;
		gameTiles[42].tilePower = true;
		gameTiles[43].tileTrap = true;
		gameTiles[44].tilePower = true;
		// Row 4
		gameTiles[45].tileTrap = true;
		gameTiles[46].tilePower = true;
		gameTiles[47].tileTrap = true;
		gameTiles[48].tilePower = true;
		gameTiles[49].tileTrap = true;
		gameTiles[50].tilePower = true;

		gameTiles[54].tilePower = true;
		gameTiles[55].tileTrap = true;
		gameTiles[56].tilePower = true;
		gameTiles[57].tileTrap = true;
		gameTiles[58].tilePower = true;
		gameTiles[59].tileTrap = true;
		// Row 5
		gameTiles[60].tilePower = true;
		gameTiles[61].tileTrap = true;
		gameTiles[62].tilePower = true;
		gameTiles[63].tileTrap = true;
		gameTiles[64].tilePower = true;
		gameTiles[65].tileTrap = true;

		gameTiles[69].tileTrap = true;
		gameTiles[70].tilePower = true;
		gameTiles[71].tileTrap = true;
		gameTiles[72].tilePower = true;
		gameTiles[73].tileTrap = true;
		gameTiles[74].tilePower = true;
		// Row 6
		gameTiles[75].tileTrap = true;
		gameTiles[76].tilePower = true;
		gameTiles[77].tileTrap = true;
		gameTiles[78].tilePower = true;
		gameTiles[79].tileTrap = true;
		gameTiles[80].tilePower = true;

		gameTiles[84].tilePower = true;
		gameTiles[85].tileTrap = true;
		gameTiles[86].tilePower = true;
		gameTiles[87].tileTrap = true;
		gameTiles[88].tilePower = true;
		gameTiles[89].tileTrap = true;
		// Row 7
		gameTiles[90].tilePower = true;
		gameTiles[91].tileTrap = true;
		gameTiles[92].tilePower = true;
		gameTiles[93].tileTrap = true;
		gameTiles[94].tilePower = true;
		gameTiles[95].tileTrap = true;

		gameTiles[99].tileTrap = true;
		gameTiles[100].tilePower = true;
		gameTiles[101].tileTrap = true;
		gameTiles[102].tilePower = true;
		gameTiles[103].tileTrap = true;
		gameTiles[104].tilePower = true;

		break;
	case levels.Level6: // Level 6
	
		tileQuota = 49; // Set Level Quota (49)
		
		// Wall States
		wallStateQuota[0] = 13;
		wallStateQuota[1] = 28;
		wallStateQuota[2] = 40;
		
		// Set Player Position
		playerBomb.playerPosition = 16;
		// Safe Tiles
		for (let i = 3; i < 103; i++)
		{
			if (i == 3 || (i >= 5 && i <= 7) || i == 9 || (i >= 13 && i <= 14) || (i >= 16 && i <= 18) || (i >= 21&& i <= 22) || i == 24
				|| (i >= 26 && i <= 27) || i == 29 || i == 33 || i == 35 || i == 37 || i == 39 || (i >= 41 && i <= 43) || (i >= 46 && i <= 48)
				|| (i >= 50 && i <= 51) || i == 54 || (i >= 56 && i <= 57) || i == 59 || i == 63 || (i >= 65 && i <= 67) || i == 69 || (i >= 73 && i <= 74)
				|| (i >= 90 && i <= 102))
				gameTiles[i].tileSafeSpace = true;
		}
		// Win Tiles
		gameTiles[104].tileWin = true;
		// No Disabled Tiles
		// Locked Tiles
		gameTiles[88].tileLocked = true;
		gameTiles[89].tileLocked = true;
		gameTiles[103].tileLocked = true;
		// No Power Up Tiles
		// No Trap Tiles
		
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
				gameTiles[i].tileColour = "Lime";
				break;
			case 6:
				gameTiles[i].tileColour = "Orange";
				break;
			}
		}
	}
	
	// Load UFO (same for each Level)
	gameUFO.ufoXPos = gameCanvas.width/2 - TILE_SIZE/2;

	// Radio Timer
	radioTimer = randomRadioNum(1000, 10000);
	
	levelLoaded = true;
}

function randomRadioNum(min, max)
 {
	return Math.floor(Math.random() * (max - min + 1)) + min;
 }
 function randomRadioSelect(min, max)
 {
	return Math.floor(Math.random() * (max - min + 1)) + min;
 }

function drawFrame(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight) {
	ctx.drawImage(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight);
}

function restartLevel()
{
	levelStartSound.play();						// Sound
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
	powerUpSound.play();					// Sound
	tileScore+=4; // Have to add 4 since the player always gets +1
	powerUpMessage = "+5 Points!"
}

function powerAddLife()
{
	powerUpSound.play();					// Sound
	playerBomb.playerCurrentHP++;
	powerUpMessage = "Extra Life!";
}

function powerIncreaseEnemySpawnTimer()
{
	powerUpSound.play();					// Sound
	multiIncrease++;
	textSpawnBall+= (textSpawnIncrease * multiIncrease);
	powerUpMessage = "Longer Enemy Spawn!";
}

function powerIncreaseSnakeSize()
{
	powerUpSound.play();					// Sound
	playerBomb.playerSnakeSize++;
	powerUpMessage = "Extra Snake Tile!";
}

function trapLosePoints()
{
	trapSound.play();						// Sound
	tileScore-=3; // Have to deduct 4 since the player always gains +1
	if (tileScore < 0)
		tileScore = 0;
	powerUpMessage = "-2 Points.";
}
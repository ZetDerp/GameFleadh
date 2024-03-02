console.log("gameInput.js Running");

function input(event)
{
	console.log("Key Event: " + event.type);
	// let canvasArea = gameCanvas.getBoundingClientRect(); // For Mouse Only
	
	// Keyboard Input
	/*
	if (event.code == "KeyP")
		enableDebug = !enableDebug; // Enable / Disable Debug
	*/
	if (currentGameStatus == gameStates.MainMenu || currentGameStatus == gameStates.LevelWin || currentGameStatus == gameStates.GameOver)
	{
		// Start Game
		if (event.code == "Space")
		{	
			if (currentGameStatus == gameStates.MainMenu || currentGameStatus == gameStates.LevelWin)
			{
				if (currentGameStatus == gameStates.LevelWin)
				{
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
					timerNextLevelCounter = 4;
					timerNextLevel = 0;
				}
				if (returnMainMenu == false)
					currentGameStatus = gameStates.Gameplay;
				else
					returnMainMenu = false;
			}
			else
			{
				if (playerBomb.playerCurrentHP - 1 <= 0)
				{
					currentGameStatus = gameStates.MainMenu;
					playerBomb.playerCurrentHP = 4; // +1 to account for restart
					currentLevel = levels.Level1;
				}
				else
					currentGameStatus = gameStates.Gameplay;
				transitionBoxWidth = 0;
				transitionBoxHeight = 10;
				transitionBoxY = gameCanvas.height/2-5;
				timerNextLevelCounter = 4;
				timerNextLevel = 0;
				gameUFO.ufoTimer = 0;
				gameUFO.ufoFire = false;
				restartLevel();
			}
		}
	}
	else if (currentGameStatus == gameStates.Gameplay)
	{
		// Player Direction
		if (event.code == "KeyW" || event.code == "ArrowUp")
		{
			if (playerBomb.playerPosition >= 15)
			{
				playerBomb.playerPosition -= 15;
				playerInput = "Up";
				playerBomb.playerDirectionFace = "Up";
			}
		}
		else if (event.code == "KeyS" || event.code == "ArrowDown")
		{
			if (playerBomb.playerPosition < 90)
			{
				playerBomb.playerPosition += 15;
				playerInput = "Down";
				playerBomb.playerDirectionFace = "Down";
			}
		}
		else if (event.code == "KeyA" || event.code == "ArrowLeft")
		{
			if (playerBomb.playerPosition != 0 && playerBomb.playerPosition != 15 && playerBomb.playerPosition != 30 
				&& playerBomb.playerPosition != 45 && playerBomb.playerPosition != 60 && playerBomb.playerPosition != 75 
				&& playerBomb.playerPosition != 90)
			{
				playerBomb.playerPosition--;
				playerInput = "Left";
				playerBomb.playerDirectionFace = "Left";
			}
		} 
		else if (event.code == "KeyD" || event.code == "ArrowRight")
		{
			if (playerBomb.playerPosition != 14 && playerBomb.playerPosition != 29 && playerBomb.playerPosition != 44 
				&& playerBomb.playerPosition != 59 && playerBomb.playerPosition != 74 && playerBomb.playerPosition != 89 
				&& playerBomb.playerPosition != 104)
			{
				playerBomb.playerPosition++;
				playerInput = "Right";
				playerBomb.playerDirectionFace = "Right";
			}
		}
		// Restart Key
		if (event.code == "KeyR")
			restartLevel();
	}
	else if (currentGameStatus == gameStates.GameOver)
	{
		
	}
}
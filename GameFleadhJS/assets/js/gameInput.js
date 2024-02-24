console.log("gameInput.js Running");

function input(event)
{
	console.log("Key Event: " + event.type);
	// let canvasArea = gameCanvas.getBoundingClientRect(); // For Mouse Only
	
	// Keyboard Input
	if (event.code == "KeyP")
		enableDebug = !enableDebug; // Enable / Disable Debug
	if (currentGameStatus == gameStates.MainMenu || currentGameStatus == gameStates.LevelWin)
	{
		// Start Game
		if (event.code == "Space")
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
					break;
				}
			}
			currentGameStatus = gameStates.Gameplay;
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
			}
		}
		else if (event.code == "KeyS" || event.code == "ArrowDown")
		{
			if (playerBomb.playerPosition < 90)
			{
				playerBomb.playerPosition += 15;
				playerInput = "Down";
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
			}
		}
	}
	else if (currentGameStatus == gameStates.GameOver)
	{
		
	}
}
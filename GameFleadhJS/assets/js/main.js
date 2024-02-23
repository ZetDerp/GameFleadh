console.log("main.js Running");

// Game Update 
function update()
{
	
}

// Game Draw
function draw()
{
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear Canvas

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
	
	// Draw Player
	yPos = playerBomb.playerPosition % 15;
	xPos = playerBomb.playerPosition - 15 * yPos;
	drawFrame(playerBomb.playerSpritesheet, 0, 0, TILE_SIZE, TILE_SIZE, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * xPos, offsetTile + offsetTileBG + (TILE_SIZE + offsetTileBG) * yPos, TILE_SIZE, TILE_SIZE);
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

function makeLevelLayout()
{
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
}

function drawFrame(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight) {
	ctx.drawImage(ssImage, ssPosX, ssPosY, ssWidth, ssHeight, canvasX, canvasY, canvasWidth, canvasHeight);
}
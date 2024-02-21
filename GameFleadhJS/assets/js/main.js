console.log("main.js Running");

// Game Update 
function update()
{
	
}

// Game Draw
function draw()
{
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear Canvas
	
	// Debug Related 
	if (enableDebug == true)
	{
		// Line to divide Gameplay to UI
		ctx.fillStyle = "black";
		ctx.fillRect((gameCanvas.width / 10) * 7, 0, 1, gameCanvas.height);
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
window.addEventListener("keydown", input);
//window.addEventListener("keyup", input);
//window.addEventListener("mousedown", input);
//window.addEventListener("mouseup", input);
//window.addEventListener("mousemove", input);
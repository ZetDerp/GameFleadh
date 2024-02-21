console.log("main.js Running");

// Game Update 
function update()
{
	
}

// Game Draw
function draw()
{
	
}

function gameLoop()
{
	update();
	draw();
	window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
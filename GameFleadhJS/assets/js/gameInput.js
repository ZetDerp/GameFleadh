console.log("gameInput.js Running");

function input(event)
{
	console.log("Key Event: " + event.type);
	// let canvasArea = gameCanvas.getBoundingClientRect(); // For Mouse Only
	
	// Keyboard Input
	if (event.code == "KeyP")
		enableDebug = !enableDebug; // Enable / Disable Debug
}
var relX, relY, objX, objY;
var dragging = false;

function onDown(e) {
	var offsetX = canvas.getBoundingClientRect().left;
	var offsetY = canvas.getBoundingClientRect().top;

	x = e.clientX - offsetX;
	y = e.clientY - offsetY;

	if (objX < x && (objX + objWidth) > x && objY < y && (objY + objHeight) > y) {
		dragging = true;
		relX = objX - x;
		relY = objY - y;
	}
}

function onMove(e) {
	var offsetX = canvas.getBoundingClientRect().left;
	var offsetY = canvas.getBoundingClientRect().top;

	x = e.clientX - offsetX;
	y = e.clientY - offsetY;

	if (dragging) {
		objX = x + relX;
		objY = y + relY;
		drawRect(e);
	}
}

function onUp(e) {
	dragging = false;
}

function drawRect(e)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(objX, objY, objWidth, objHeight);
}

canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);
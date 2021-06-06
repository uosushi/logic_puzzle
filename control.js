var panel = document.getElementById("control-panel");
var panelContext = panel.getContext('2d');
var commandOffsetTop = 30;
var commandOffsetLeft = 30;

var commands = new Image();
commands.src = './commands.png';

function drawCommands()
{
	for (x = 0; x < 4; x++)
	{
		var commandX = x * (30 + 5) + 30;
		panelContext.drawImage(commands, x * 30, 0, 30, 30, commandX, 30, 30, 30);
	}
	for (x = 0; x < 3; x++)
	{
		var commandX = x * (30 + 5) + 30;
		panelContext.drawImage(commands, (x+4) * 30, 0, 30, 30, commandX, 65, 30, 30);
	}
	for (x = 0; x < 3; x++)
	{
		var commandX = x * (30 + 5) + 30;
		panelContext.drawImage(commands, (x+7) * 30, 0, 30, 30, commandX, 100, 30, 30);
	}
}
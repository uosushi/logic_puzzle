var panel = document.getElementById("control-panel");
var panelContext = panel.getContext('2d');
var commandOffsetTop = 30;
var commandOffsetLeft = 30;

var commands = new Image();
commands.src = './commands.png';
var selected = [0, 0];

function drawStroke(x, y, n)
{
	panelContext.beginPath();
	panelContext.rect(x * 35 + 30, y * 35 + 30, n * 30, 30);
	panelContext.lineWidth = 0.5;
	panelContext.stroke();
	for (i=0; i<n; i++)
	{
		panelContext.beginPath();
		panelContext.moveTo(x * 35 + 30 + i*30, y * 35 + 30);
		panelContext.lineTo(x * 35 + 30 + i*30, y * 35 + 60);
		panelContext.lineWidth = 0.5;
		panelContext.stroke();
	}
}

/** 全てのコマンドを書き出す関数 */
function drawCommands()
{
	for (y = 0; y < 4; y++)
	{
		for (x = 0; x < 3; x++)
		{
			let commandX = x * (30 + 5) + 30;
			panelContext.drawImage(commands, (x+y*3) * 30, 0, 30, 30, commandX, 30+35*y, 30, 30);
		}
	}
}

const INIT_F = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
/** 有効なfの枠全てを書き出す関数 */
function drawFunction()
{
	let fn = LEVEL[n]["fn"];
	panelContext.clearRect(5 * (30 + 5) + 30, 30, 200, 105);
	f = [];
	for (i=0; i<3; i++)
	{
		let commandX = 5 * (30 + 5) + 30;
		panelContext.drawImage(commands, (9+i) * 30, 0, 30, 30, commandX, 30+(35*i), 30, 30);
		drawStroke(6, i, fn[i]);
		f.push(INIT_F.slice(fn[i]-1));
	}
}

function setCommands(y, x)
{
	let i = selected[0];
	let j = selected[1];
	// commandを求める（y * 3 + x - 3）;
	// クリックされたのが`command`か`condition`かを三項演算子で求める（y > 0 ? 0 : 1）
	// yが0ならcondition
	let terms = y == 0 ? 1 : 0;
	let oldCommand = f[i][j][terms];
	let newCommand = (y * 3 + x) - (y == 0 ? 0 : 3);
	if (oldCommand != newCommand)
	{
		f[i][j][terms] = newCommand;
	}
	else if (oldCommand == newCommand)
	{
		f[i][j][terms] = -1;
	}
	panelContext.clearRect(j * 30 + 241, i * 35 + 31, 28, 28);
	if (f[i][j][1] != -1)
	{
		panelContext.drawImage(commands, f[i][j][1] * 30, 0, 30, 30, j * 30 + 241, i * 35 + 31, 28, 28);
	}
	if (f[i][j][0] != -1)
	{
		panelContext.drawImage(commands, (f[i][j][0]+3) * 30, 0, 30, 30, j * 30 + 241, i * 35 + 31, 28, 28);
	}
}


panel.addEventListener("click", e => {
	// マウスの座標をCanvas内の座標とあわせるため
	let rect = panel.getBoundingClientRect();
	let point = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};

	// クリック判定処理
	// commands範囲かどうか
	if (point.y >= 30 && point.x >= 30 && point.y <= 165 && point.x <= 130)
	{
		let y = Math.floor((point.y - 30) / 35);
		let x = Math.floor((point.x - 30) / 35);
		if (selected != [0, 0])
		{
			setCommands(y, x);
		}
	}
	// functions範囲かどうか
	else if (point.y >= 30 && point.x >= 235 && point.y <= 130 && point.x <= 445)
	{
		let y = Math.floor((point.y - 30) / 35);
		let x = Math.floor((point.x - 235) / 35);
		if (x < LEVEL[n]["fn"][y]) {
			selected = [y, x];
		}
	};
});
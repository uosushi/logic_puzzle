var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var tileOffsetTop = 30;
var tileOffsetLeft = 30;
var tileWidth = 30;
var tileHeight = 30;
var tilePadding = 5;
var tiles;
var star;
var flag;
var speed;
var f1 = [[1, 0],[]];

var tilechip = new Image();
tilechip.src = './tilechip.png';

var rocketX, rocketY, rocketRotate;

var rocket = new Image();
rocket.src = './rocket.png';

var speed = 500;

// max: 10(width)x20(height)

const level1_map = [
	[5, 2, 2, 2, 5]
];
const level2_map = [
	[-1, -1, -1,  2,  5],
	[-1, -1,  2,  2, -1],
	[-1,  2,  2, -1, -1],
	[ 2,  2, -1, -1, -1],
	[ 2, -1, -1, -1, -1]
];

function drawTiles(set_tiles)
{
	tiles = JSON.parse(JSON.stringify(set_tiles));
	context.clearRect(0, 0, 800, 400);
	star = 0;
	for (y = 0; y < tiles.length; y++)
	{
		for (x = 0; x < tiles[y].length; x++)
		{
			if (tiles[y][x] == -1)
			{
				continue ;
			}
			var tileY = y * (tileHeight + tilePadding) + tileOffsetTop;
			var tileX = x * (tileWidth  + tilePadding) + tileOffsetLeft;
			context.drawImage(tilechip, tiles[y][x] * tileWidth, 0, tileWidth, tileHeight, tileX, tileY, tileWidth, tileHeight);
			if (tiles[y][x] >= 3)
			{
				star += 1;
			}
		}
	}
}

function drawRocket(y, x, rotate)
{
	var rocketNowY = (y * (tileHeight + tilePadding)) + tileOffsetTop;
	var rocketNowX = (x * (tileWidth + tilePadding)) + tileOffsetLeft;
	rocketY = y;
	rocketX = x;
	rocketRotate = rotate;

	context.save();
	context.translate(rocketNowX - tileWidth/2 -tilePadding, rocketNowY - tileHeight/2 -tilePadding);
	context.rotate(rotate * 90 * Math.PI/180);
	context.drawImage(rocket, 0, 0, 75, 75, -tileWidth/2, -tileHeight/2, tileWidth, tileHeight);
	context.restore();
}

/**
 * Rocketの操作を反映させる関数  
 * - 引数`command`は直進するとき1の値をもつ  
 * - 引数`rotate`は方向転換の増減分（+1で90度右, -1で90度左）  
 * - 引数`opt_conditions`は初期値として-1の値をもち、移動元のタイルと比較して操作を実行するか決める  
 * - 引数`opt_paint`は初期値として-1の値をもち、値を代入されたときは移動先のタイルを指定された色に塗りかえる。  
 */
async function moveRocket(command, rotate, opt_conditions = -1, opt_paint = -1, opt_fn = -1)
{
	if (flag)
	{
		return ;
	}
	// x軸とy軸の増減をrotate考慮で算出
	var y, x;
	if (rocketRotate % 4 == 1)
	{
		y = 0;
		x = command;
	}
	else if (rocketRotate % 4 == 2)
	{
		y = -command;
		x = 0;
	}
	else if (rocketRotate % 4 == 3)
	{
		y = 0;
		x = -command;
	}
	else if (rocketRotate % 4 == 0)
	{
		y = command;
		x = 0;
	}

	// 移動元のRocketとタイルは操作に寄らず一度消去
	context.clearRect((rocketX - 1) * (tileWidth + tilePadding) + tileOffsetLeft, (rocketY - 1) * (tileHeight + tilePadding) + tileOffsetTop, tileWidth, tileHeight);

	// 移動元のタイルは操作に寄らず再描画
	var tileY = (rocketY - 1) * (tileHeight + tilePadding) + tileOffsetTop;
	var tileX = (rocketX - 1) * (tileWidth  + tilePadding) + tileOffsetLeft;
	context.drawImage(tilechip, tiles[rocketY - 1][rocketX - 1] * tileWidth, 0, tileWidth, tileHeight, tileX, tileY, tileWidth, tileHeight);

	// 移動元のタイルが操作条件に合っていれば、移動後のRocketの座標を記録
	if (opt_conditions == -1 || opt_conditions == tiles[rocketY - 1][rocketX - 1] || opt_conditions+3 == tiles[rocketY - 1][rocketX - 1])
	{
		// 移動後の座標を記録
		rocketY += y;
		rocketX += x;
		var rocketNowY = rocketY * (tileHeight + tilePadding) + tileOffsetTop;
		var rocketNowX = rocketX * (tileWidth  + tilePadding) + tileOffsetLeft;

		// 移動先のタイルを消去
		context.clearRect((rocketX - 1) * (tileWidth + tilePadding) + tileOffsetLeft, (rocketY - 1) * (tileHeight + tilePadding) + tileOffsetTop, tileWidth, tileHeight);
		tileY = (rocketY - 1) * (tileHeight + tilePadding) + tileOffsetTop;
		tileX = (rocketX - 1) * (tileWidth  + tilePadding) + tileOffsetLeft;

		// 移動先のタイルに星があればタイルを星なしのものへ変更
		if (tiles[rocketY - 1][rocketX - 1] >= 3)
		{
			tiles[rocketY - 1][rocketX - 1] -= 3;
			star -= 1;
		}
		// opt_paintに指定があったらその色に塗りかえる
		// 色は0,1,2なので、-1は確実に色を指定していない
		if (opt_paint != -1)
		{
			tiles[rocketY - 1][rocketX - 1] = opt_paint;
		}
		// 移動先のタイルを再描画
		context.drawImage(tilechip, tiles[rocketY - 1][rocketX - 1] * tileWidth, 0, tileWidth, tileHeight, tileX, tileY, tileWidth, tileHeight);
	}
	context.save();
	context.translate(rocketNowX - tileWidth/2 - tilePadding, rocketNowY - tileHeight/2 - tilePadding);
	context.rotate((rocketRotate + rotate) * 90 * Math.PI/180);
	context.drawImage(rocket, 0, 0, 75, 75, -tileWidth/2, -tileHeight/2, tileWidth, tileHeight);
	context.restore();
	rocketRotate += rotate;
	console.log(star);

	await sleep(500);
	if (rocketY > tiles.length || rocketX < 0 || rocketX > tiles[0].length || rocketX < 0)
	{
		alert("RANGE OVER!");
		drawTiles(level1_map);
		drawRocket(1, 3, 1);
		flag = 1;
	}
	else if (star == 0)
	{
		alert("Game clear!!");
		flag = 1;
	}
	return ;
}

function sleep(ms) {
	if (flag)
	{
		return ;
	}
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function testFn() {
	flag = 0;
	// 前に1マス進む
	await sleep(speed);
	moveRocket(1, 0);

	// 青を緑に塗りつぶし
	await sleep(speed);
	moveRocket(0, 0, 2, 1);

	// 前に1マス進む
	await sleep(speed);
	moveRocket(1, 0);

	// 右に方向転換
	await sleep(speed);
	moveRocket(0, 1);

	// 右に方向転換
	await sleep(speed);
	moveRocket(0, 1);

	// 前に1マス進む
	await sleep(speed);
	moveRocket(1, 0);

	// 緑を青に塗りつぶし
	await sleep(speed);
	moveRocket(0, 0, 1, 2);

	// 前に1マス進む
	await sleep(speed);
	moveRocket(1, 0);

	// 前に1マス進む
	await sleep(speed);
	moveRocket(1, 0);
	

	// 前に1マス進む
	await sleep(speed);
	moveRocket(1, 0);
}
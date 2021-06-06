var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var tileOffsetTop = 30;
var tileOffsetLeft = 30;
var tileWidth = 30;
var tileHeight = 30;
var tilePadding = 5;
var tiles;
var star = 0;

var tilechip = new Image();
tilechip.src = './tilechip.png';

var rocketX, rocketY, rocketRotate;

var rocket = new Image();
rocket.src = './rocket.png';

var speed = 700;

// max: 10(width)x20(height)

var level1_map = [
	[5, 2, 2, 2, 5]
];


function drawTiles(set_tiles)
{
	tiles = set_tiles;
	for (y = 0; y < tiles.length; y++)
	{
		for (x = 0; x < tiles[y].length; x++)
		{
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

// 操作を反映させる
// commandが1のときは直進
function moveRocket(command, rotate, opt_conditions = -1, opt_paint = -1)
{
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
	if (opt_conditions == -1 || opt_conditions == tiles[rocketY][rocketX] || opt_conditions+3 == tiles[rocketY][rocketX])
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
		if (tiles[rocketY - 1][rocketX - 1]>=3)
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
	setTimeout( function() {
		if (star==0)
		{
			alert("Game clear!!");
			return ;
		}
		if (rocketY > tiles.length || rocketX > tiles[0].length)
		{
			alert("RANGE OVER!");
			return ;
		}
	}, 500);
}

function testFn() {
	// 前に1マス進む
	moveRocket(1, 0);
	// 前に1マス進む
	setTimeout( function() {moveRocket(1, 0);}, speed *1);
	// 右に方向転換
	setTimeout( function() {moveRocket(0, 1);}, speed *2);
	// 右に方向転換
	setTimeout( function() {moveRocket(0, 1);}, speed *3);
	// 前に1マス進む
	setTimeout( function() {moveRocket(1, 0);}, speed *4);
	// 前に1マス進む
	setTimeout( function() {moveRocket(1, 0);}, speed *5);
	// 前に1マス進む
	setTimeout( function() {moveRocket(1, 0);}, speed *6);
	// 前に1マス進む
	setTimeout( function() {moveRocket(1, 0);}, speed *7);
}
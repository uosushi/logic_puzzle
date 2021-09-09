var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var tileOffset = 30;
var tileSide = 30;
var tilePadding = 5;
var tiles;
var star;
var flag;
var speed;
/** 現在のレベル（0はじまり） */
var n = 0;

var tilechip = new Image();
tilechip.src = './tilechip.png';

var rocketX, rocketY, rocketRotate;

var rocket = new Image();
rocket.src = './rocket.png';

var speed = 500;

/** `[f1, f2, f3]` */
var f = [];

const LEVEL = [
	// level1
	{
		"board": [
			[5, 2, 2, 2, 3]
		],
		"point": [
			0, 2, 1
		],
		"fn": [
			4, 0, 0
		],
		"timeout": 50
	},
	// level2
	{
		"board": [
			[-1, -1, -1,  2,  5],
			[-1, -1,  2,  2, -1],
			[-1,  2,  2, -1, -1],
			[ 2,  2, -1, -1, -1],
			[ 2, -1, -1, -1, -1]
		],
		"point": [
			4, 0, 0
		],
		"fn": [
			6, 0, 0
		],
		"timeout": 50
	}
];

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function init()
{
	tiles = JSON.parse(JSON.stringify(LEVEL[n].board));
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
			let tileY = y * (tileSide + tilePadding) + tileOffset;
			let tileX = x * (tileSide + tilePadding) + tileOffset;
			context.drawImage(tilechip, tiles[y][x] * tileSide, 0, tileSide, tileSide, tileX, tileY, tileSide, tileSide);
			if (tiles[y][x] >= 3)
			{
				star += 1;
			}
		}
	}
	rocketY				= LEVEL[n].point[0];
	rocketX				= LEVEL[n].point[1];
	rocketRotate	= LEVEL[n].point[2];
	let rocketNowY = (rocketY + 1) * (tileSide + tilePadding) + tileOffset;
	let rocketNowX = (rocketX + 1) * (tileSide + tilePadding) + tileOffset;

	context.save();
	context.translate(rocketNowX - tileSide/2 - tilePadding, rocketNowY - tileSide/2 - tilePadding);
	context.rotate(rocketRotate * 90 * Math.PI/180);
	context.drawImage(rocket, 0, 0, 75, 75, -tileSide/2, -tileSide/2, tileSide, tileSide);
	context.restore();
}


const CHANGE = [
	[1, 0], [0, 1], [-1, 0], [0, -1]
]
/**
 * **Rocketの操作を反映させる関数**  
 * @param {number} command 初期値として`-1`の値をもつ  
 */
async function moveRocket(command)
{
	let rotate = 0;
	if (command == 1 || command == 2)
	{
		rotate = command == 1 ? 1 : -1;
	}
	// x軸とy軸の増減をrotate考慮で算出
	let y = 0;
	let x = 0;
	if (command == 0)
	{
		let yx = CHANGE[rocketRotate % 4];
		y = yx[0];
		x = yx[1];
	}
	else if (command > 5)
	{
		return renderFunction(command - 6);
	}

	// 移動元のRocketとタイルは操作に寄らず一度消去
	context.clearRect(rocketX * (tileSide + tilePadding) + tileOffset, rocketY * (tileSide + tilePadding) + tileOffset, tileSide, tileSide);

	// 移動元のタイルは操作に寄らず再描画
	let tileY = rocketY * (tileSide + tilePadding) + tileOffset;
	let tileX = rocketX * (tileSide + tilePadding) + tileOffset;
	context.drawImage(tilechip, tiles[rocketY][rocketX] * tileSide, 0, tileSide, tileSide, tileX, tileY, tileSide, tileSide);

	// 移動していなくても、移動後の座標を記録（+0で変動しないため）
	rocketY += y;
	rocketX += x;
	let rocketNowY = (rocketY + 1) * (tileSide + tilePadding) + tileOffset;
	let rocketNowX = (rocketX + 1) * (tileSide + tilePadding) + tileOffset;

	// 移動先のタイルを消去
	context.clearRect(rocketX * (tileSide + tilePadding) + tileOffset, rocketY * (tileSide + tilePadding) + tileOffset, tileSide, tileSide);

	// 移動先のtile始点座標を取得
	tileY = rocketY * (tileSide + tilePadding) + tileOffset;
	tileX = rocketX * (tileSide + tilePadding) + tileOffset;

	// 移動先のタイルに星があればタイルを星なしのものへ変更
	if (tiles[rocketY][rocketX] >= 3)
	{
		tiles[rocketY][rocketX] -= 3;
		star -= 1;
	}

	// rotateを反映させる
	rocketRotate += rotate;

	// 色は0,1,2なので、3 > paint > -1 のときのみぬりかえ実行
	let paint = command - 3;
	if (3 > paint && paint > -1)
	{
		tiles[rocketY][rocketX] = paint;
	}

	// 移動先のタイルを再描画
	context.drawImage(tilechip, tiles[rocketY][rocketX] * tileSide, 0, tileSide, tileSide, tileX, tileY, tileSide, tileSide);

	// 移動先のRocketを再描画
	context.save();
	context.translate(rocketNowX - tileSide/2 - tilePadding, rocketNowY - tileSide/2 - tilePadding);
	context.rotate(rocketRotate * 90 * Math.PI/180);
	context.drawImage(rocket, 0, 0, 75, 75, -tileSide/2, -tileSide/2, tileSide, tileSide);
	context.restore();
	console.log(star);
	return ;
}

/**
 * **`fi[j]`が実行可能か判定し、順次実行していく再帰関数**
 * @param {number} fi `f[任意のi]`が代入されている
 * @param {number} j `fi`の`j`番目の要素を確認するために用意された変数。  
 * `0`始まりで`len`まで1ずつカウントアップする
 * @param {number} len `fi`の長さ
 */
async function recursive(fi, j, len)
{
	time++;
	if (time >= LEVEL[n].timeout || j == len || flag)
	{
		return ;
	}
	let command = fi[j][0];
	let y = command == 0 ? CHANGE[rocketRotate % 4][0]+rocketY : rocketY;
	let x = command == 0 ? CHANGE[rocketRotate % 4][1]+rocketX : rocketX;
	let H = tiles.length - 1;
	let W = tiles[0].length - 1;

	// このLevelをクリアしたかを判定 || 移動できるかを判定
	if (star == 0 || y > H || y < 0 || x > W || x < 0 || !~tiles[y][x])
	{
		await sleep(speed);
		alert(star == 0 ? "Game clear! :D" : "Range over! :(");
		if (star == 0) {
			n += 1;
			init();
			drawFunction();
		}
		else
		{
			init();
		}
		flag = true;
		return ;
	}
	let condition = fi[j][1];
	// 移動元のタイルが操作条件に合っているか
	if (!~condition || condition == tiles[rocketY][rocketX] || condition+3 == tiles[rocketY][rocketX])
	{
		await sleep(speed);
		await moveRocket(command);
	}
	await recursive(fi, j+1, len);
}

/**
 * **f[i]を実行する関数**
 * @param {number} i `f1,f2,f3`のうちどれを実行するかを`0`始まりで指定
 */
async function renderFunction(i)
{
	let len = f[i].length;
	await recursive(f[i], 0, len);
} 

var time;
/** 非同期関数 保存された操作を実行する */
async function run(btn) {
	btn.disabled = true;
	time = 0;
	flag = false;

	// f1を実行
	renderFunction(0)
	.then(() => {
		if (time >= LEVEL[n].timeout)
		{
			alert("Time out! :(");
			init();
		}
		console.log("End");
		btn.disabled = false;
	})
}
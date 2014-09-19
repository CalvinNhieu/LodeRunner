FPS = 60;
startup = true;
resets = 0;

$(document).ready(function() {
	c=document.getElementById("canvas");
	c.width=750;
	c.height=450;
	$("div").animate({opacity:1.0},1500);
	$("#canvas").animate({opacity:1.0},4000);
	ctx=c.getContext("2d");
	init();
	setInterval(function(){
		rect = c.getBoundingClientRect();
        draw();
		update();
		
	},1000/FPS);
});

init = function() {
	if (startup) { /*on initial load only*/
		tileSize = 15;
		counter = 0;
		enemyMoveCounter = 0;
		door = false;
		level = new Array();
		level[0] = true;
		level[1] = false;
		level[2] = false;
		level[3] = false;
        level[4] = false;
		pause = false;
		/*3 FONTS*/
		pauseAnimation = true;
		pauseCounter = 0;
		closestLadderX = 1000;
		lastLadderX = 1000;
		validLadder = true;
		startup = false;
	}
	tileArray = new Array(30); /*declare 1d array*/
	for (var i = 0; i <= 29; i++) {
		tileArray[i] = new Array(50); /*declare 2d array*/
	}
	for (var yTile = 0; yTile <= 29; yTile++) { /*fill 2d tile array*/
		for (var xTile = 0; xTile <= 49; xTile++) {
			tile = new Tile (xTile*tileSize, yTile*tileSize, 0);
			tileArray [yTile][xTile] = tile;
		}
	}

	player = new Runner (0,0);

	/*-- LEVEL 1 --*/
	if (level[0]) {
		player = new Runner (30, 45);
			
		enemy = new Array(5);
		enemy [0] = new Runner (690, 165);
		enemy [1] = new Runner (100, 405);
		enemy [2] = new Runner (300, 405);
		enemy [3] = new Runner (565, 270);
		enemy [4] = new Runner (565, 390);
		for (var i = 0; i < enemy.length; i++) {
			enemy[i].direction[0] = true;
		}

/* -----------------------------TILE GENERATOR----------------------------- 
    **CREATES A BODY OF TILES USING "tileGenerator" METHOD @ LINE 162**

REQUIRES 5 INPUTS: 1. FIRST X TILE (CLOSEST TO THE LEFT)
	       2. FIRST Y TILE (CLOSEST TO THE TOP)
	       3. FINAL X TILE 
	       4. FINAL Y TILE
	       5. TYPE OF TILE (0 = air, 1 = ground, 2 = bars, 3 = ladders, 4 = destroyed ground, 5 = gold)
	       6. ALLOWED TO FALL THROUGH? (TRUE/FALSE)

*/
		// define Ground tiles (left)
		tileGenerator(0, 28, 23, 29, 1, false); // base platform Left
		tileGenerator(0, 3, 0, 27, 1, false); // left wall
		tileGenerator(0, 4, 12, 4, 1, true); // skinny platform (top)
		tileGenerator(3, 11, 12, 15, 1, false); // fat platform 
		tileGenerator(13, 4, 20, 15, 1, false); // tall platform
		tileGenerator(15, 23, 21, 23, 1, true); // skinny platform (bot)
		tileGenerator(15, 19, 21, 19, 1, true); // skinny platform (2nd bot)
		tileGenerator(24, 27, 49, 29, 1, false); // base platform right
		tileGenerator(49, 11, 49, 26, 1, false); // right wall
		tileGenerator(21, 5, 31, 5, 1, true); // skinny platform middle (top)
		tileGenerator(21, 11, 31, 11, 1, true); // skinny platform middle (middle)
		tileGenerator(30, 19, 44, 19, 1, true); // skinny platform far right
		tileGenerator(30, 23, 44, 24, 1, false); // 2x2 far right
		tileGenerator(44, 12, 48, 13, 1, false); // far right platform (middle)
	
		// define Bar tiles (left) (ordered left to right)
		tileGenerator(1, 17, 12, 17, 2, false);
		tileGenerator(32, 4, 35, 4, 2, false);
		tileGenerator(35, 6, 38, 6, 2, false);
		tileGenerator(38, 8, 41, 8, 2, false);
		tileGenerator(41, 10, 44, 10, 2, false);
		tileGenerator(31, 14, 43, 14, 2, false);
	
		// define Ladder tiles (left) (ordered left to right)
		tileGenerator(4, 11, 4, 27, 3, false);
		tileGenerator(11, 4, 11, 10, 3, false);
		tileGenerator(15, 23, 15, 27, 3, false);
		tileGenerator(17, 4, 17, 18, 3, false);
		tileGenerator(20, 19, 20, 22, 3, false);
		tileGenerator(23, 5, 23, 10, 3, false);
		tileGenerator(29, 5, 29, 10, 3, false);
		tileGenerator(30, 15, 30, 26, 3, false);
		tileGenerator(35, 19, 35, 22, 3, false);
		tileGenerator(40, 19, 40, 22, 3, false);
		tileGenerator(44, 23, 44, 26, 3, false);
	
		//stray tiles
		tileArray[4][26].type = 1;
		tileArray[10][31].type = 1;
		tileArray[26][24].type = 1;     
		
		// define indestructible
		tileArray[4][10].indestructible = true;
		tileArray[4][12].indestructible = true;
		tileArray[4][16].indestructible = true;
		tileArray[4][18].indestructible = true;
        tileArray[4][20].indestructible = true;
		tileArray[5][22].indestructible = true;
		tileArray[5][24].indestructible = true;
		tileArray[5][28].indestructible = true;
		tileArray[5][30].indestructible = true;
		tileArray[11][3].indestructible = true;
		tileArray[11][5].indestructible = true;
		tileArray[11][10].indestructible = true;
		tileArray[11][11].indestructible = true;
		tileArray[11][12].indestructible = true;
		tileArray[11][22].indestructible = true;
		tileArray[11][23].indestructible = true;
		tileArray[11][24].indestructible = true;
		tileArray[11][28].indestructible = true;
		tileArray[11][29].indestructible = true;
		tileArray[11][30].indestructible = true;
		tileArray[19][15].indestructible = true;
		tileArray[19][16].indestructible = true;
		tileArray[19][17].indestructible = true;
		tileArray[19][18].indestructible = true;
		tileArray[19][19].indestructible = true;
		tileArray[19][20].indestructible = true;
		tileArray[19][21].indestructible = true;
		tileArray[19][34].indestructible = true;
		tileArray[19][36].indestructible = true;
		tileArray[19][39].indestructible = true;
		tileArray[19][41].indestructible = true;
		tileArray[23][16].indestructible = true;
		tileArray[23][17].indestructible = true;
		tileArray[23][18].indestructible = true;
		tileArray[23][19].indestructible = true;
		tileArray[23][20].indestructible = true;
		tileArray[23][21].indestructible = true;
		tileArray[23][34].indestructible = true;
		tileArray[23][35].indestructible = true;
		tileArray[23][36].indestructible = true;
		tileArray[23][39].indestructible = true;
		tileArray[23][40].indestructible = true;
		tileArray[23][41].indestructible = true;
		tileArray[23][43].indestructible = true;
		tileArray[27][29].indestructible = true;
		tileArray[27][30].indestructible = true;
		tileArray[27][31].indestructible = true;
		tileArray[27][43].indestructible = true;
		tileArray[27][44].indestructible = true;
		tileArray[27][45].indestructible = true;
		tileArray[28][3].indestructible = true;
		tileArray[28][4].indestructible = true;
		tileArray[28][5].indestructible = true;
		tileArray[28][14].indestructible = true;
		tileArray[28][15].indestructible = true;
		tileArray[28][16].indestructible = true;
		
		// define Gold tiles (ordered to collect)
		tileArray[3][10].gold = 2;
		tileArray[13][2].gold = 1;
		tileArray[19][13].gold = 1;
		tileArray[4][35].gold = 1;
		tileArray[6][38].gold = 1;
		tileArray[8][41].gold = 1;
		tileArray[10][44].gold = 1;
		tileArray[11][48].gold = 1;
		tileArray[17][34].gold = 2;             
		tileArray[17][41].gold = 2;
		tileArray[26][43].gold = 3;
	}

	if (level[1]) {
		player.shots = 0;
		player.xpos = 700;
		player.ypos = 390;
		
		enemy = new Array(5);
		enemy [0]= new Runner (585, 30);
		enemy [1]= new Runner (405, 150);
		enemy [2]= new Runner (285, 315);
		enemy [3] = new Runner (220, 150);
		enemy [4] = new Runner (345, 315);
		for (var i = 0; i < enemy.length; i++) {
			enemy[i].direction[0] = true;
		}
		
		// define Ground
		tileGenerator(0, 27, 49, 29, 1, false); // Base
		tileGenerator(4, 24, 38, 24, 1, true); // skinny above base
		tileGenerator(0, 0, 0, 27, 1, false); // Left wall
		tileGenerator(49, 2, 49, 27, 1, false); // Right wall
		tileGenerator(39, 4, 39, 26, 1, false); // tallest
		tileGenerator(41, 4, 41, 25, 1, false); // 2nd tallest (right)
		tileGenerator(38, 3, 41, 3, 1, true); // skinny top (right)
		tileGenerator(42, 8, 48, 8, 1, true); // skinny far right (higher)
		tileGenerator(42, 17, 48, 17, 1, true); // skinny far right (lower)
		tileGenerator(7, 8, 35, 8, 1, true); // 1st lateral
		tileGenerator(7, 11, 35, 11, 1, true); // 2nd lateral
		tileGenerator(4, 14, 38, 14, 1, true); // middle lateral of cross
		tileGenerator(4, 16, 38, 16, 1, true); // laterals....
		tileGenerator(4, 18, 38, 18, 1, true);
		tileGenerator(4, 20, 38, 20, 1, true);
		tileGenerator(4, 22, 38, 22, 1, true); // ....
		tileGenerator(20, 5, 22, 23, 1, false); // vertical of cross
		tileGenerator(1, 12, 3, 25, 1, false); // far left (door platform)      
		
		// define Bars
		// 1st structure (right)
		tileGenerator(42, 2, 48, 2, 2, false);
		tileGenerator(44, 11, 48, 11, 2, false);
		tileGenerator(42, 14, 46, 14, 2, false);
		tileGenerator(44, 20, 48, 20, 2, false);
		tileGenerator(42, 23, 46, 23, 2, false);
		// cross structure
		tileGenerator(7, 2, 37, 2, 2, false); // toppp
		tileGenerator(7, 4, 19, 4, 2, false); // top left
		tileGenerator(23, 4, 35, 4, 2, false); // top right
		tileGenerator(20, 7, 22, 7, 2, false); // 1st x3
		tileGenerator(20, 10, 22, 10, 2, false); // 2nd x3
		
		// define Ladders
		tileGenerator(40, 3, 40, 26, 3, false); // tallest
		tileGenerator(1, 12, 1, 26, 3, false); // ladder to door (left)
		tileGenerator(7, 5, 7, 13, 3, false); // right in cross top
		tileGenerator(19, 5, 19, 13, 3, false); // 2nd in cross top
		tileGenerator(23, 5, 23, 13, 3, false); // 3rd in cross top
		tileGenerator(35, 5, 35, 13, 3, false); // 4th in cross top
		tileGenerator(38, 14, 38, 23, 3, false); // 1st in cross bot
		tileGenerator(4, 14, 4, 23, 3, false); // 2nd in cross bot
		
		// define stray

		// define Air
		tileGenerator(20, 15, 22, 15, 0, false); 
		tileGenerator(20, 19, 22, 19, 0, false); 
		tileGenerator(20, 23, 22, 23, 0, false); 
		
		// define indestructible
		tileArray[3][38].indestructible = true;
		tileArray[3][39].indestructible = true;
		tileArray[3][41].indestructible = true;
		tileArray[12][2].indestructible = true;
		tileArray[12][3].indestructible = true;
		tileArray[14][5].indestructible = true;
		tileArray[14][6].indestructible = true;
		tileArray[14][7].indestructible = true;
		tileArray[14][8].indestructible = true;
		tileArray[14][18].indestructible = true;
		tileArray[14][19].indestructible = true;
		tileArray[14][23].indestructible = true;
		tileArray[14][24].indestructible = true;
		tileArray[14][34].indestructible = true;
		tileArray[14][35].indestructible = true;
		tileArray[14][36].indestructible = true;
		tileArray[14][37].indestructible = true;
		tileArray[24][4].indestructible = true;
		tileArray[24][5].indestructible = true;
		tileArray[24][37].indestructible = true;
		tileArray[24][38].indestructible = true;
		tileArray[27][2].indestructible = true;
		tileArray[27][3].indestructible = true;
		tileArray[27][40].indestructible = true;
		tileArray[27][41].indestructible = true;
		
		// define Gold
		tileArray[10][46].gold = 1;
		tileArray[13][44].gold = 1;
		tileArray[19][46].gold = 1;
		tileArray[22][44].gold = 1;
		tileArray[4][21].gold = 2;
		tileArray[7][21].gold = 2;
		tileArray[10][21].gold = 2;
		tileArray[17][13].gold = 3;
		tileArray[17][29].gold = 3;
		tileArray[21][13].gold = 3;
		tileArray[21][29].gold = 3;
	}

	// LEVEL 2 --------------------------------------------------------
	if (level[2]) {
		player.shots = 0;
		player.xpos = 30;
		player.ypos = 165;
		
		enemy = new Array(5);
		enemy [0]= new Runner (45, 405);
		enemy [1]= new Runner (270, 240);
		enemy [2]= new Runner (525, 150);
		enemy [3] = new Runner (315, 285);
		enemy [4] = new Runner (450, 240);
		for (var i = 0; i < enemy.length; i++) {
			enemy[i].direction[0] = true;
        }
		
		// define Ground
		tileGenerator(0, 28, 49, 29, 1, false); // base
		tileGenerator(49, 2, 49, 27, 1, false); // right wall
		tileGenerator(45, 3, 47, 25, 1, false); // right wall fat
		tileGenerator(0, 12, 2, 20, 1, false); // left 1st box
		tileGenerator(12, 12, 13, 20, 1, false); // right 1st box
		tileGenerator(9, 9, 11, 12, 1, false); // left 2nd box
		tileGenerator(21, 9, 22, 17, 1, false); // right 2nd box
		tileGenerator(18, 6, 20, 9, 1, false); // left 3rd box
		tileGenerator(30, 6, 31, 14, 1, false); // right 3rd box
		tileGenerator(27, 3, 29, 6, 1, false); // left 4th box
		tileGenerator(39, 3, 40, 11, 1, false); // right 4th box
		tileGenerator(3, 12, 8, 12, 1, true); // top 1st box
		tileGenerator(3, 20, 11, 20, 1, true); // bot 1st box
		tileGenerator(12, 9, 17, 9, 1, true); // top 2nd box
		tileGenerator(14, 17, 20, 17, 1, true); // bot 2nd box
		tileGenerator(21, 6, 26, 6, 1, true); // top 3rd box
		tileGenerator(23, 14, 29, 14, 1, true); // bot 3rd box
		tileGenerator(30, 3, 38, 3, 1, true); // top 4th box
		tileGenerator(32, 11, 38, 11, 1, true); // bot 4th box
		tileGenerator(18, 20, 24, 20, 1, true); // 5th box top
		tileGenerator(27, 20, 29, 23, 1, true); // 5th box right
		tileGenerator(16, 20, 17, 23, 1, false); // 5th box left
		tileGenerator(25, 17, 26, 20, 1, false); // 6th box left
		tileGenerator(36, 17, 38, 23, 1, true); // 6th box right
		tileGenerator(27, 17, 33, 17, 1, true); // 6th box top
		tileGenerator(36, 14, 44, 14, 1, true); // 7th box top
		tileGenerator(34, 14, 35, 17, 1, false); // 7th box left
		
		tileGenerator(1, 23, 3, 24, 1, false); // above door
		tileGenerator(0, 11, 0, 27, 1, false); // left wall
		tileGenerator(4, 23, 44, 25, 1, false); // 2nd bottom
		tileGenerator(4, 26, 25, 26, 1, false); // sliver
		
		
		// define Bars
		tileGenerator(14, 11, 18, 11, 2, false); // sq2
		tileGenerator(23, 8, 27, 8, 2, false); // sq3
		tileGenerator(32, 5, 36, 5, 2, false); // sq4
		tileGenerator(30, 19, 33, 19, 2, false); // sq5
		tileGenerator(39, 16, 42, 16, 2, false); // sq5
		tileGenerator(41, 2, 44, 2, 2, false); // outside top right
		
		// define Ladders
		tileGenerator(8, 9, 8, 11, 3, false); // top layer
		tileGenerator(17, 6, 17, 8, 3, false); // top layer
		tileGenerator(26, 3, 26, 5, 3, false); // top layer
		tileGenerator(44, 3, 44, 13, 3, false); // right
		tileGenerator(48, 3, 48, 27, 3, false); // rightest
		tileGenerator(16, 20, 16, 22, 3, false); // 2nd layer
		tileGenerator(25, 17, 25, 19, 3, false); // 2nd layer
		tileGenerator(34, 14, 34, 16, 3, false); // 2nd layer
		tileGenerator(3, 12, 3, 19, 3, false); // sq1
		tileGenerator(12, 9, 12, 11, 3, false); // sq2 short
		tileGenerator(14, 12, 14, 16, 3, false); // sq2 long
		tileGenerator(21, 6, 21, 8, 3, false); // sq3 short
		tileGenerator(23, 9, 23, 13, 3, false); // sq3 long
		tileGenerator(30, 3, 30, 5, 3, false); // sq4 short
		tileGenerator(32, 6, 32, 10, 3, false); // sq4 long
		tileGenerator(18, 20, 18, 22, 3, false); // sq5
		tileGenerator(27, 17, 27, 19, 3, false); // sq6 short
		tileGenerator(30, 20, 30, 22, 3, false); // sq6 long
		tileGenerator(36, 14, 36, 16, 3, false); // sq7 short
		tileGenerator(39, 17, 39, 22, 3, false); // sq7 long
		
		// define indestructible
		tileArray[12][2].indestructible = true;
		tileArray[12][4].indestructible = true;
		tileArray[12][7].indestructible = true;
		tileArray[12][8].indestructible = true;
		tileArray[12][12].indestructible = true;
		tileArray[12][13].indestructible = true;
		tileArray[9][9].indestructible = true;
		tileArray[9][11].indestructible = true;
		tileArray[9][13].indestructible = true;
		tileArray[9][16].indestructible = true;
		tileArray[9][17].indestructible = true;
		tileArray[9][21].indestructible = true;
		tileArray[9][22].indestructible = true;
		tileArray[6][18].indestructible = true;
		tileArray[6][20].indestructible = true;
		tileArray[6][22].indestructible = true;
		tileArray[6][25].indestructible = true;
		tileArray[6][26].indestructible = true;
		tileArray[6][30].indestructible = true;
		tileArray[6][31].indestructible = true;
		tileArray[3][27].indestructible = true;
		tileArray[3][29].indestructible = true;
		tileArray[3][31].indestructible = true;
		tileArray[3][45].indestructible = true;
		tileArray[3][47].indestructible = true;
		tileArray[11][32].indestructible = true;
		tileArray[11][33].indestructible = true;
		tileArray[14][23].indestructible = true;
		tileArray[14][24].indestructible = true;
		tileArray[14][35].indestructible = true;
		tileArray[14][37].indestructible = true;
		tileArray[14][43].indestructible = true;
		tileArray[14][44].indestructible = true;
		tileArray[17][14].indestructible = true;
		tileArray[17][15].indestructible = true;
		tileArray[17][26].indestructible = true;
		tileArray[17][28].indestructible = true;
		tileArray[17][33].indestructible = true;
		tileArray[17][34].indestructible = true;
		tileArray[17][37].indestructible = true;
		tileArray[17][38].indestructible = true;
		tileArray[20][3].indestructible = true;
		tileArray[20][4].indestructible = true;
		tileArray[20][17].indestructible = true;
		tileArray[20][19].indestructible = true;
		tileArray[20][28].indestructible = true;
		tileArray[20][29].indestructible = true;
		tileArray[23][15].indestructible = true;
		tileArray[23][16].indestructible = true;
		tileArray[23][18].indestructible = true;
		tileArray[23][19].indestructible = true;
		tileArray[23][30].indestructible = true;
		tileArray[23][31].indestructible = true;
		tileArray[23][39].indestructible = true;
		tileArray[23][40].indestructible = true;
		
		// define Gold
		tileArray[19][7].gold = 1;
		tileArray[19][9].gold = 1;
		tileArray[19][11].gold = 1;
		tileArray[11][19].gold = 1;
		tileArray[13][19].gold = 1;
		tileArray[15][19].gold = 2;
		tileArray[8][28].gold = 1;
		tileArray[10][28].gold = 1;
		tileArray[12][28].gold = 2;
		tileArray[5][37].gold = 1;
		tileArray[7][37].gold = 1;
		tileArray[9][37].gold = 2;
		tileArray[22][22].gold = 1;
		tileArray[22][24].gold = 1;
		tileArray[22][26].gold = 1;
		tileArray[19][34].gold = 1;
		tileArray[21][34].gold = 2;
		tileArray[16][43].gold = 1;
		tileArray[18][43].gold = 1;
		tileArray[20][43].gold = 2;
		tileArray[27][4].gold = 1;
		tileArray[22][2].gold = 3;
		tileArray[11][42].gold = 3;
	}
    if (level[3]) {
        player.shots = 0;
		player.xpos = 30;
		player.ypos = 405;
		
		enemy = new Array(5);
		enemy [0]= new Runner (450, 405);
		enemy [1]= new Runner (510, 405);
		enemy [2]= new Runner (570, 405);
		enemy [3] = new Runner (630, 405);
		enemy [4] = new Runner (690, 405);
		for (var i = 0; i < enemy.length; i++) {
			enemy[i].direction[0] = true;
        }
		
		// define Ground
		tileGenerator(0, 28, 49, 29, 1, false); // base
    }
    if(level[4]) {
        player.shots = 0;
		player.xpos = 150;
		player.ypos = 285;
        
        enemy = new Array();
        
        tileGenerator(4, 19, 4, 19, 1, false); // top bar
        
        tileGenerator(5, 19, 9, 19, 2, false); // top bar
        tileGenerator(10, 20, 15, 20, 1, false); // top left
        tileGenerator(16, 19, 22, 19, 2, false); // top bar
        tileGenerator(23, 20, 30, 20, 1, false); // top right
        tileGenerator(31, 19, 35, 19, 2, false); // top bar
        
        tileGenerator(10, 23, 15, 23, 1, false); // top left
        tileGenerator(16, 22, 22, 22, 2, false); // top bar
        tileGenerator(23, 23, 30, 23, 1, false); // top right
        
        tileGenerator(13,20,13,22,3,false);

    }

	document.addEventListener('keydown', function(e) {
        if (!player.interact[0]) {
            if (e.keyCode == 39) {
                    directRight(player);
            }
            if (e.keyCode == 37) {
                    directLeft(player);
            }
            if (e.keyCode == 38) {
                if (player.interact[3] || player.interact[9]){
                    directUp(player);
                }
            }
        }
            if (e.keyCode == 40) {
                if ((player.interact[2] || player.interact[3] || player.interact[8]) && !(player.interact[1] && player.interact[2])) {
                    directDown(player);
                }
            }
		if (e.keyCode == 81) {
			player.lives--;
			if (level[0]) {
				player.xpos = 30;
				player.ypos = 45;
			}
			if (level[1]) {
				player.xpos = 700;
				player.ypos = 390;
			}
			if (level[2]) {
				player.xpos = 30;
				player.ypos = 165;
			}
		}
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
		if (e.keyCode == 88) {
			if (!pause) {
				player.shoot[0] = true;
			}
		}
		if (e.keyCode == 90) {
		    if (!pause) {
				player.shoot[1] = true;
			}
		}
		if (e.keyCode == 32) {
			if (!pause) {
				pause = true;
				//lobby.loop();
				//track.stop();
		    }
		}
		if (e.keyCode == 80) {
            document.getElementById("test").innerHTML=path(enemy[0],parseInt(enemy[0].xpos/tileSize));
			if (pause) {
                pause = false;
				//lobby.stop();
				//track.loop();
		    }
		}
    }, false);

	document.addEventListener('keyup', function(e) {
		if (e.keyCode == 39) {
			player.direction[0] = false;
		}
		if (e.keyCode == 37) {
			player.direction[1] = false;
		}
		if (e.keyCode == 38) {
			player.direction[2] = false;
		}
		if (e.keyCode == 40) {
			player.direction[3] = false;
		}
    }, false);
};

Color = function (r,g,b) {
  this.Red = r;
  this.Green = g;
  this.Blue = b;
};

Runner = function(xpos,ypos){
		this.xpos = xpos;
		this.ypos = ypos;
		this.score = 0;
		this.lives = 3;
		this.shots = 0;
        this.MAXSHOTS=30;
		this.deadCounter = 0;

		this.direction = new Array();
		this.direction[0] = false; /*right*/
		this.direction[1] = false; /*left*/
		this.direction[2] = false; /*up*/
		this.direction[3] = false; /*down*/
		this.lastDirection = 0; 

		this.interact = new Array();
		this.interact[0] = false; /*air*/
		this.interact[1] = true;  /*ground*/
		this.interact[2] = false; /*bar*/
		this.interact[3] = false; /*ladders*/
		this.interact[5] = false; /*right wall*/
		this.interact[6] = false; /*left wall*/
		this.interact[7] = false; /*lateral on ladders*/
        this.interact[8] = false; /*ladder top*/
        this.interact[9] = false; /*ladder bottom*/

		this.moving = new Array();
		this.moving[0] = false; /*right*/
		this.moving[1] = false; /*left*/
		this.moving[2] = false; /*up*/
		this.moving[3] = false; /*down*/

		this.falling = false;

		/*ENEMY*/
		this.gold = false;
		this.scaling = false;
        this.descending = false;
        this.patrolling = true;
		/*ENEMY*/

		this.shoot = new Array();
		this.shoot[0] = false;
		this.shoot[1] = false;

		this.walkAnimation = 1;
		this.ladderAnimation = 1;
		this.barAnimation = 1;
		this.fallAnimation = 1;
};

Tile = function(xpos, ypos, type) {
	this.xpos = xpos;
	this.ypos = ypos;
	this.type = type; /*0-air,1-ground,2-bar,3-ladder*/

	this.gold = 0;
	this.destroyed = false;
	this.thinDestroyed = false;
	this.indestructible = false;
};

tileGenerator = function (firstX, firstY, lastX, lastY, type, t) {
    for (var yTile = firstY; yTile <= lastY; yTile++) {
		for (var xTile = firstX; xTile <= lastX; xTile++) {
			tileArray[yTile][xTile].type = type;
			tileArray[yTile][xTile].thin = t;
		}
    } 
};





//ENEMY THINKING METHOD
enemyAI = function(p) {
    if (p.ypos == player.ypos) {
        if (path(p,parseInt(p.xpos/tileSize))) {
            pursue(p);
            return;
        }
    }
    if ((p.scaling && !p.moving[2]) || (p.descending && !p.moving[3])) {
        p.scaling = false;
        p.patrolling = true;
    }
    if(player.ypos < p.ypos) {
        if (p.interact[1] && p.interact[9] && !p.scaling && !p.descending && p.xpos%tileSize<5) beginScale(p);
        else if (p.scaling && !p.patrolling) scale(p);
    }
    else if (player.ypos > p.ypos) {
        if (p.interact[8] && !p.descending) beginDescend(p);
        else if (p.descending && !p.patrolling) descend(p);
    }
    if (p.patrolling) patrol(p);
};

path = function (p,xTile) {
    if (player.xpos > p.xpos) {
        if (tileArray[parseInt(p.ypos/tileSize)][xTile].type == 1) return false;
        else if (xTile*tileSize < player.xpos)return path(p,xTile+1);
        else return true;
    }
    else if (player.xpos < p.xpos) {
        if (tileArray[parseInt(p.ypos/tileSize)][xTile].type == 1) return false;
        else if (xTile*tileSize > player.xpos) return path(p,xTile-1);
        else return true;
    }
    return true;
};

beginScale = function(p) {
    directUp(p);
    p.scaling = true;
    p.descending = false;
    p.patrolling = false;
};

scale = function(p) {
    directUp(p);
    if (p.interact[8]) {
        p.scaling = false;
        p.patrolling = true;
    }
};
    
beginDescend = function(p) {
    directDown(p);
    p.scaling = false;
    p.descending = true;
    p.patrolling = false;
};

descend = function(p) {
    directDown(p);
    if (!p.moving[3]) {
        p.descending = false;
        p.patrolling = true;
    }
};

patrol = function(p) {
    p.scaling = false;
    p.descending = false;
    r = Math.random();
    if (p.interact[5] || tileArray[parseInt(p.ypos/tileSize)+1][parseInt(p.xpos/tileSize)+1].type == 0) directLeft(p); // RIGHT SIDE BOUNDARY
    if (p.interact[6] || tileArray[parseInt(p.ypos/tileSize)+1][parseInt(p.xpos/tileSize)].type == 0) directRight(p); // LEFT SIDE BOUNDARY
    if (r > 0.99) { // RANDOM ALTERATIONS
        if (p.lastDirection==1) directRight(p);
        else if (p.lastDirection==0) directLeft(p);
    }
    if (p.lastDirection!=0 && p.lastDirection!=1) {
        if (r>0.5) directRight(p);
        else directLeft(p);
    }
};

pursue = function(p) {
    if (p.xpos > player.xpos) directLeft(p);
    else directRight(p);
};

deflt = function(p) {
    directRight(p);
};






update = function() {
    if(enemy[0].interact[0]){ 
        document.getElementById("air").style.color="green";
    }
    else{ 
        document.getElementById("air").style.color="red";
    }
    if(enemy[0].interact[1]){ document.getElementById("grd").style.color="green";
                     }
    else{ 
        document.getElementById("grd").style.color="red";
    }
    if(enemy[0].interact[2]){ 
        document.getElementById("bar").style.color="green";
    }
    else{ 
        document.getElementById("bar").style.color="red";
    }
    if(enemy[0].interact[3]){ 
        document.getElementById("lad").style.color="green";
    }
    else{ 
        document.getElementById("lad").style.color="red";
    }
    if(enemy[0].interact[5]){ 
        document.getElementById("rig").style.color="green";
    }
    else{ 
        document.getElementById("rig").style.color="red";
    }
    if(enemy[0].interact[6]){ 
        document.getElementById("lef").style.color="green";
    }
    else{ 
        document.getElementById("lef").style.color="red";
    }
    if(enemy[0].interact[8]){ 
        document.getElementById("lat").style.color="green";
    }
    else{ 
        document.getElementById("lat").style.color="red";
    }
    if(enemy[0].interact[9]){ 
        document.getElementById("lab").style.color="green";
    }
    else{ 
        document.getElementById("lab").style.color="red";
    }


    if (!pause) {
        interactGround(player);
        interactWalls(player);
        interactBars(player);
        interactLadders(player);
        interactLadder2(player);
        interactAir(player);
        respawn(player);
        collectGold(player);
        playerAdjust (player);
        playerMove(player);
    
    
        for (var i = 0; i < enemy.length; i++) {
            enemyAI(enemy[i]);
            playerAdjust (enemy[i]);
            interactGround(enemy[i]);
            interactWalls(enemy[i]);
            interactBars(enemy[i]);
            interactLadders(enemy[i]);
            interactLadder2(enemy[i]);
            interactAir(enemy[i]);
            checkKill(enemy[i]);
            if (!enemy[i].gold) {
                enemyCollectGold(enemy[i]);
            }
            dropGold(enemy[i]);
            playerMove(enemy[i]);
        }
    
        if (player.shots < player.MAXSHOTS) {
            if (player.shoot[0]) {
                shootRight(player);
            }
            if (player.shoot[1]) {
                shootLeft(player);
            }
        }
    
        if (!door) {
            door = checkDoor();
        }
        checkWin(player);
    }
	
};

// PLAYER INTERACT METHODS
// INTERACT GROUND
interactGround = function(p) {
    // CONVERT POS VALUES TO TILE INDICES
    yTile=parseInt(p.ypos/tileSize);
    xTile=parseInt(p.xpos/tileSize);
    
    if (p.xpos%tileSize==0 && tileArray[yTile+1][xTile].type==0){
        p.interact[1]=false;
        return;
    }
    
    if (tileArray[yTile+1][xTile+1].type==1) {
        p.interact[1]=true;
    }
    else if(tileArray[yTile+1][xTile].type==1) {
        p.interact[1]=true;
    }
    else {
        p.interact[1]=false;
    }
};

// INTERACT WALLS
 interactWalls = function(p) {
     // CONVERT POS VALUES TO TILE INDICES
    yTile=parseInt(p.ypos/tileSize);
    xTile=parseInt(p.xpos/tileSize);
     
    // RIGHT SIDE
    if (p.lastDirection == 0 && tileArray[yTile][xTile+1].type == 1) {
		p.interact[5] = true;
    }
    else {
		p.interact[5] = false;
    }
    
    // LEFT SIDE
    if (p.lastDirection == 1 && tileArray[yTile][xTile].type == 1) {
		p.interact[6] = true;
    }
    else {
		p.interact[6] = false;
    }
 };
	 
// INTERACT BARS
interactBars = function(p){
    // CONVERT POS VALUES TO TILE INDICES
    yTile=parseInt(p.ypos/tileSize);
    xTile=parseInt(p.xpos/tileSize);
    
    // LEFT SIDE
    if (p.ypos==yTile*tileSize) {
        if(p.lastDirection==1 && tileArray[yTile][xTile+1].type==2) {
            p.interact[2]=true;
            return;
        }
        //RIGHT SIDE
        if(tileArray[yTile][xTile].type==2) {
            p.interact[2]=true;
            return;
        }
    }
    p.interact[2]=false;
};

// INTERACT LADDERS
interactLadders = function(p) {
    // CONVERT POS VALUES TO TILE INDICES
    yTile=parseInt(p.ypos/tileSize);
    xTile=parseInt(p.xpos/tileSize);
    
    // ON LADDER
    // GOING DOWN
    if ((p.lastDirection==3 || p.lastDirection==0 || p.lastDirection==1) && tileArray[yTile+1][xTile].type==3 &&  p.ypos<(yTile+1)*tileSize) {
        p.interact[3]=true;
    }
    // GOING UP
    else if ((p.lastDirection==2 || p.lastDirection==0 || p.lastDirection==1) && tileArray[yTile+1][xTile].type==3 &&  p.ypos>(yTile-1)*tileSize) {
        p.interact[3]=true;
    }
    else {
        p.interact[3]=false;
    }
    
    // TOP OF LADDER
    if(tileArray[yTile][xTile].type!=3 && tileArray[yTile+1][xTile].type==3 && p.ypos==yTile*tileSize) {
        p.interact[8]=true;
        p.interact[3]=false;
        return;
    }
    else if (tileArray[yTile][xTile].type!=3 && tileArray[yTile+1][xTile+1].type==3 && p.ypos==yTile*tileSize) {
        p.interact[8]=true;
        p.interact[3]=false;
    }
    else {
        p.interact[8]=false;
    }
    // BOTTOM OF LADDER
    if ((tileArray[yTile][xTile].type==3 && p.ypos==yTile*tileSize) || (tileArray[yTile][xTile].type!=3 && tileArray[yTile+1][xTile].type!=3 && tileArray[yTile][xTile+1].type==3 && p.ypos==yTile*tileSize)) {
        p.interact[9]=true;
    }
    else{
        p.interact[9]=false;
    }
};


interactLadder2 = function(p) {
    // CONVERT POS VALUES TO TILE INDICES
    yTile=parseInt(p.ypos/tileSize);
    xTile=parseInt(p.xpos/tileSize);
    
    // CONVERT POS VALUES TO TILE INDICES
    if (tileArray[yTile][xTile+1].type==3 || tileArray[yTile][xTile].type==3) {
        p.interact[7] = true;
    }
    else {
        p.interact[7] = false;
    }
};

// INTERACT AIR
interactAir = function(p) {
    if(!p.interact[1] && !p.interact[2] && !p.interact[3] && !p.interact[7] && !p.interact[8] && !p.interact[9] ){
        p.interact[0]=true;
        return;
    }
    p.interact[0]=false;
 };
 

// PLAYER MOVE AND KEYS---------------------------------------
// DIRECTION METHODS
directRight = function(p) {
    p.direction[0] = true;
    p.direction[1] = false;
    p.direction[2] = false;
    p.direction[3] = false;
};
directLeft = function(p) {
    p.direction[0] = false;
    p.direction[1] = true;
    p.direction[2] = false;
    p.direction[3] = false;
};
directUp = function(p) {
    p.direction[0] = false;
    p.direction[1] = false;
    p.direction[2] = true;
    p.direction[3] = false;
};
directDown = function(p) {
    p.direction[0] = false;
    p.direction[1] = false;
    p.direction[2] = false;
    p.direction[3] = true;
};

playerMove = function(p) {
    
	if (p.direction[0] && (p.interact[1] || p.interact[2] || p.interact[8] || p.interact[7]) && !p.interact[5]) { // if player is pressing right && is interacting with ground/bars/laddertop and not right wall
		p.xpos = p.xpos + 1;
		p.moving[0] = true; // declares player IS moving right
		p.lastDirection = 0;
		//walk.play();
	}
	else if (p.direction[1] && (p.interact[1] || p.interact[2] || p.interact[8] || p.interact[7]) && !p.interact[6]) { // if player is pressing left && is interacting with ground/bars/ladder(walk) and not left wall
		p.xpos = p.xpos - 1;
		p.moving[1] = true; // declares player IS moving left
		p.lastDirection = 1;
		//walk.play();
	}
	else {
	    p.moving[0] = false;
	    p.moving[1] = false;
	}
	
	if (p.direction[2] && (p.interact[3] || p.interact[9])) { // if player is pressing up && is interacting with ladders
		p.ypos = p.ypos - 1;
		p.moving[2] = true; // declares player is moving up
		p.lastDirection = 2;
	}
	else if (p.direction[3] && (p.interact[3] || p.interact[8] || p.interact[2])) { // if player is pressing down && is interacting with ladders OR (interacting with bars but not ground)
		p.ypos = p.ypos + 1;
		p.moving[3] = true; // declares playing is moving down
		p.falling = true;
		p.lastDirection = 3;
	}
	else {
	    p.moving[2] = false;
	    p.moving[3] = false;
	}
	
	if (p.interact[0]) {
	    p.ypos = p.ypos + 1;
	    p.falling = true;
	}
	else {
		p.falling = false;
	}
};

// GOLD METHODS
collectGold = function (p) {
    // CONVERT POS VALUES TO TILE INDICES
    yTile=parseInt(p.ypos/tileSize);
    xTile=parseInt(p.xpos/tileSize);
    //document.getElementById("test").innerHTML=p.xpos%tileSize;
	if (p.moving[1] && tileArray[yTile][xTile].gold > 0) {
		p.score += 100*tileArray[yTile][xTile].gold;
		tileArray[yTile][xTile].gold = 0;
		//getCashMoney.play();
	}
	else if (p.moving[0] && tileArray[yTile][(xTile) + 1].gold > 0) {
		p.score += 100*tileArray[yTile][(xTile) + 1].gold;
		tileArray[yTile][(xTile) + 1].gold = 0;
		//getCashMoney.play();
	}
	else if (p.moving[2] && tileArray[(yTile)][xTile].gold > 0) {
		p.score += 100*tileArray[(yTile)][xTile].gold;
		tileArray[yTile][xTile].gold = 0;
		//getCashMoney.play();
	}
	else if (p.falling && tileArray[(yTile)+1][(xTile)+1].gold > 0 && p.xpos%tileSize >= 10) {
		p.score += 100*tileArray[(yTile)+1][(xTile)+1].gold;
		tileArray[(yTile) + 1][(xTile)+1].gold = 0;
		//getCashMoney.play();
	}
	else if (p.falling && tileArray[(yTile)+1][(xTile)].gold > 0 && (p.xpos%tileSize <10)) {
		p.score += 100*tileArray[(yTile)+1][(xTile)].gold;
		tileArray[(yTile) + 1][(xTile)].gold = 0;
		//getCashMoney.play();
	}
};

enemyCollectGold = function (p) {
	if (p.moving[1] && tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].gold > 0) {
		p.gold = true;
		tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].gold -= 1;
	}
	else if (p.moving[0] && tileArray[parseInt(p.ypos/tileSize)][(parseInt(p.xpos/tileSize)) + 1].gold > 0) {
		p.gold = true;
		tileArray[parseInt(p.ypos/tileSize)][(parseInt(p.xpos/tileSize)) + 1].gold -= 1;
	}
	else if (p.moving[2] && tileArray[(parseInt(p.ypos/tileSize))][parseInt(p.xpos/tileSize)].gold > 0) {
		p.gold = true;
		tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].gold -= 1;
	}
	else if (p.falling && tileArray[(parseInt(p.ypos/tileSize))+1][(parseInt(p.xpos/tileSize))+1].gold > 0 && p.xpos%tileSize >= 10) {
		p.gold = true;
		tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))+1].gold -= 1;
	}
	else if (p.falling && tileArray[(parseInt(p.ypos/tileSize))+1][(parseInt(p.xpos/tileSize))].gold > 0 && (p.xpos%tileSize < 10)) {
		p.gold = true;
		tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].gold -= 1;
	}
};

dropGold = function(p) {
	if (tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].destroyed) {
		tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].type = 1;
		if (p.deadCounter == 0){
			//die.play();
		}
		p.deadCounter++;
		if (p.gold) {
			p.gold = false;
			tileArray[(parseInt(p.ypos/tileSize))-1][parseInt(p.xpos/tileSize)].gold += 1;
		}
	}
	if (p.deadCounter >= 200) {
		p.ypos = p.ypos - tileSize;
		p.deadCounter = 0;
	}
}

// PLAYER SHOOT METHOD
shootRight=function (p) {
	if(!pause) {
	if (p.interact[1]&& tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].type == 1 && (tileArray[parseInt(p.ypos/tileSize)][(parseInt(p.xpos/tileSize)) + 1].type == 0)) {
		if (!(tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].indestructible)) {
			tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].type = 0;
			if (!(tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].thin)) {
				tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].destroyed = true;
				p.shots++;
			}
			else if (tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].thin) {
				tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 1].thinDestroyed = true;
				p.shots++;
			}
		}
	}
	else if (p.interact[1] && tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].type == 1 && tileArray[parseInt(p.ypos/tileSize)][(parseInt(p.xpos/tileSize)) + 2].type == 0) {
		if (!tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].indestructible) {
			tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].type = 0;
			if (!(tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].thin)) {
				tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].destroyed = true;
				p.shots++;
			}
			else if (tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].thin) {
				tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) + 2].thinDestroyed = true;
				p.shots++;
			}
		}
	}
	//shoot.play();
	}
    p.shoot[0] = false;
};
shootLeft=function (p) {
	if (!pause) {
		if (p.interact[1] && tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].type == 1 && tileArray[parseInt(p.ypos/tileSize)][(parseInt(p.xpos/tileSize)) - 1].type == 0) {
			if (!tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].indestructible) {
				tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].type = 0;
				if (!(tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].thin)) {
					tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].destroyed = true;
					p.shots++;
				}
				else if (tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].thin) {
					tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize)) - 1].thinDestroyed = true;
					p.shots++;
				}
			}
		}
		else if (p.interact[1] && tileArray[(parseInt(p.ypos/tileSize)) + 1][parseInt(p.xpos/tileSize)].type == 1 && tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].type == 0) {
			if (!tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].indestructible) {
				tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].type = 0;
				if (!(tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].thin)) {
					tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].destroyed = true;
					p.shots++;
				}
				else if (tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].thin) {
					tileArray[(parseInt(p.ypos/tileSize)) + 1][(parseInt(p.xpos/tileSize))].thinDestroyed = true;
					p.shots++;
				}
			}
		}
		//shoot.play();
	}
    p.shoot[1] = false;
};

// PLAYER POSITION RESET
playerAdjust=function(p) {
    if (p.xpos%tileSize!=0) {
        if ((p.moving[0] || p.moving[1]) && p.ypos%tileSize <= 10) {
                p.ypos = p.ypos - (p.ypos%tileSize);
        }
        if ((p.moving[0] || p.moving[1]) && p.ypos%tileSize >= 3 && p.ypos%tileSize < tileSize) {
          p.ypos = p.ypos + (tileSize - p.ypos%tileSize);
        }
    
        if (p.interact[3]) {
            if (p.moving[2] || p.moving[3]) {
                    p.xpos = p.xpos - (p.xpos%tileSize);
            }
        }
        // FOR LEFT SIDE OF BOTTOM OF LADDER
        if (p.interact[9]) {
            if(tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].type!=3) {
                    if(p.direction[2]) {
                        p.xpos = p.xpos + (tileSize-p.xpos%tileSize);
                    }
                }
        }
        // FOR LEFT SIDE OF TOP OF LADDER
        if (p.interact[8]) {
            if(tileArray[parseInt(p.ypos/tileSize)+1][parseInt(p.xpos/tileSize)].type!=3) {
                    if(p.direction[3]) {
                        p.xpos = p.xpos + (tileSize-p.xpos%tileSize);
                    }
                }
        }
        if (p.interact[5] && p.xpos%tileSize < 7) {
            p.xpos = p.xpos - (p.xpos%tileSize);
        }
        else if (p.interact[6] && p.xpos%tileSize > 8) {
            p.xpos = p.xpos + (tileSize - p.xpos%tileSize);
        }
        if(p.interact[0] && p.lastDirection[0]) {
            p.xpos = parseInt(p.xpos/tileSize)*tileSize;
        }
    }
};



checkKill=function (p) {
	if (p.xpos < player.xpos+13 && p.xpos+13 > player.xpos && p.ypos+13 > player.ypos && p.ypos < player.ypos+13) {
		if (level[0]) {
			player.xpos = 30;
			player.ypos = 45;
		}
		if (level[1]) {
			player.xpos = 700;
			player.ypos = 390;
		}
		if (level[2]) {
			player.xpos = 30;
			player.ypos = 165;
		}
		player.lives--;
		if (player.lives < 0) {
			startup = true;
			init();
		}
	}
};

// RESPAWN IF DEAD
respawn=function (p) {
	if (tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].destroyed) {
		tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].destroyed = false;
		tileArray[parseInt(p.ypos/tileSize)][parseInt(p.xpos/tileSize)].type = 1;
		if (level[0]) {
			p.xpos = 30;
			p.ypos = 45;
			//respawn.play();
		}
		if (level[1]) {
			p.xpos = 700;
			p.ypos = 390;
			//respawn.play();
		}
		if (level[2]) {
			p.xpos = 30;
			p.ypos = 165;
			//respawn.play();
		}
		p.lives--;
	}
	if (p.lives < 0) {
		startup = true;
		init();
	}
}

// CHECK TO OPEN ENDGAME DOOR
checkDoor=function() {
	for (var i = 0; i < enemy.length; i++) {
		if (enemy[i].gold) { 
			door = false;
			return door;
		}
	}
	for (var yTile = 0; yTile <= 29; yTile++) {
		for (var xTile = 0; xTile <= 49; xTile++) {
			if (tileArray[yTile][xTile].gold > 0) {
				door = false;
				return door;
			}
		}
	}
	door = true;
	return door;
};

// CHECK IF FINISHED LEVEL
checkWin =function(p) {
	if (level[0] && door) {
		if (p.xpos >= 705 && p.ypos >= 378) {
			level[0] = false;
			level[1] = true;
			door = false;
			init();
		}
	}
	if (level[1] && door) {
		if (p.xpos >= 23 && p.xpos <= 45 && p.ypos <= 165) {
			level[1] = false;
			level[2] = true;
			door = false;
			init();
		}
	}
	if (level[2] && door) {
		if (p.xpos >= 20 && p.xpos <= 45 && p.ypos >= 390) {
			level[2] = false;
			level[3] = true;
			door = false;
			init();
		}
	}
}






























draw = function() {
	random = new Color (0,0,0);
	random2 = new Color (0,0,0);
	//g.setFont(original);
    if (level[3]) {
        ctx.fillStyle = "#FFFFFF";
    }
    else {
        ctx.fillStyle = "#000000"
    }
	ctx.fillRect(0,0,750,450);
	
	// draw Ground
	if (level[3]){
        ctx.strokeStyle = "#000000";
    }
    else {
        ctx.strokeStyle = "#FFFFFF";
    }
	for (var yTile = 0; yTile <= 29; yTile++) {
		for (var xTile = 0; xTile <= 49; xTile++) {
			if (tileArray[yTile][xTile].type == 1) {
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+tileSize-4, tileArray[yTile][xTile].ypos+7);
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+tileSize);
			}
		}
	}
    //drawRect(tileArray[parseInt(player.ypos/tileSize)][parseInt(player.xpos/tileSize)].xpos,tileArray[parseInt(player.ypos/tileSize)][parseInt(player.xpos/tileSize)].ypos,tileSize,tileSize);


	// draw indestructible Ground
	ctx.strokeStyle = "#444444";
	for (var yTile = 0; yTile <= 29; yTile++) {
		for (var xTile = 0; xTile <= 49; xTile++) {
			if (tileArray[yTile][xTile].indestructible) {
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+tileSize-4, tileArray[yTile][xTile].ypos+7);
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+tileSize);
			}
		}
	}

	if (level[0]) {
		ctx.strokeStyle = "#00FF00";
	}
	if (level[1]) {
		ctx.strokeStyle = "#FF99CC";
	}
	if (level[2]) {
		ctx.strokeStyle = "#66FFFF";
	}

	// draw Bars
	for (var yTile = 0; yTile <= 29; yTile++) {
		for (var xTile = 0; xTile <= 49; xTile++) {
			if (tileArray[yTile][xTile].type == 2) {
				drawLine(tileArray[yTile][xTile].xpos, tileArray[yTile][xTile].ypos, tileArray[yTile][xTile].xpos+tileSize, tileArray[yTile][xTile].ypos);
				drawLine(tileArray[yTile][xTile].xpos, tileArray[yTile][xTile].ypos, tileArray[yTile][xTile].xpos+tileSize, tileArray[yTile][xTile].ypos+2);
			}
		}
	}
	
	// draw Ladders
	for (var yTile = 0; yTile <= 29; yTile++) {
		for (var xTile = 0; xTile <= 49; xTile++) {
			if (tileArray[yTile][xTile].type == 3) {
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+tileSize-4, tileArray[yTile][xTile].ypos+7);
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+10);
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+14, tileArray[yTile][xTile].xpos+tileSize-4, tileArray[yTile][xTile].ypos+14);
				drawLine (tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+14, tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+17);
			}
		}
	}

	// draw Gold
	for (var yTile = 0; yTile <= 29; yTile++) {
		for (var xTile = 0; xTile <= 49; xTile++) {
			if (tileArray[yTile][xTile].gold > 0) {
				ctx.fillStyle = "#FFFF00";
				if (tileArray[yTile][xTile].gold == 1) {
					fillCircle(tileArray[yTile][xTile].xpos+8, tileArray[yTile][xTile].ypos+8, 4);
				}
				if (tileArray[yTile][xTile].gold == 2) {
					fillPoly4(tileArray[yTile][xTile].xpos+5, tileArray[yTile][xTile].ypos+10, tileArray[yTile][xTile].xpos+8, tileArray[yTile][xTile].ypos, tileArray[yTile][xTile].xpos+11, tileArray[yTile][xTile].ypos+10, tileArray[yTile][xTile].xpos+8, tileArray[yTile][xTile].ypos+tileSize);
				}
				if (tileArray[yTile][xTile].gold == 3) {
					fillStar(tileArray[yTile][xTile].xpos, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+5, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+7, 
						tileArray[yTile][xTile].ypos+2, tileArray[yTile][xTile].xpos+9, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+14, tileArray[yTile][xTile].ypos+7, 
						tileArray[yTile][xTile].xpos+10, tileArray[yTile][xTile].ypos+9, tileArray[yTile][xTile].xpos+12, tileArray[yTile][xTile].ypos+14, tileArray[yTile][xTile].xpos+7, 
						tileArray[yTile][xTile].ypos+11, tileArray[yTile][xTile].xpos+3, tileArray[yTile][xTile].ypos+14, tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+9);
				}
				
				ctx.strokeStyle = "#FF0000";
				if (tileArray[yTile][xTile].gold == 1) {
					drawCircle(tileArray[yTile][xTile].xpos+8, tileArray[yTile][xTile].ypos+8, 4);
				}
				if (tileArray[yTile][xTile].gold == 2) {
					drawPoly4(tileArray[yTile][xTile].xpos+5, tileArray[yTile][xTile].ypos+10, tileArray[yTile][xTile].xpos+8, tileArray[yTile][xTile].ypos, tileArray[yTile][xTile].xpos+11, tileArray[yTile][xTile].ypos+10, tileArray[yTile][xTile].xpos+8, tileArray[yTile][xTile].ypos+tileSize);
				}
				if (tileArray[yTile][xTile].gold == 3) {
					drawStar(tileArray[yTile][xTile].xpos, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+5, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+7, 
						tileArray[yTile][xTile].ypos+2, tileArray[yTile][xTile].xpos+9, tileArray[yTile][xTile].ypos+7, tileArray[yTile][xTile].xpos+14, tileArray[yTile][xTile].ypos+7, 
						tileArray[yTile][xTile].xpos+10, tileArray[yTile][xTile].ypos+9, tileArray[yTile][xTile].xpos+12, tileArray[yTile][xTile].ypos+14, tileArray[yTile][xTile].xpos+7, 
						tileArray[yTile][xTile].ypos+11, tileArray[yTile][xTile].xpos+3, tileArray[yTile][xTile].ypos+14, tileArray[yTile][xTile].xpos+4, tileArray[yTile][xTile].ypos+9);
				}
			}
		}
	}

	// draw Door
	if ((door && level[0]) || level[1]) {
		ctx.strokeStyle = "#FFFFFF";
		drawRect(690, 378, 10, 30);
		drawRect(720, 378, 10, 30);
		drawRect(690, 368, 40, 10);
		if ((!door && level[1]) || (door && level[0])) {
			if (counter < 230) {
				random = new Color (counter, counter, counter);
				counter ++;
			}
			else if (counter > 0) {
				random = new Color (counter, 0, counter);
				counter --;
			}
			//ctx.fillStyle = "rgba(random.Red,random.Green,random.Blue,1)";
			if (level[0]) {
				ctx.fillStyle = "#FF99CC";
			}
			else if (level[1]) {
				ctx.fillStyle = "#00FF00";
			}
		}
		else if (door && level[1]) {
			ctx.fillStyle = "#222222";
		}
		ctx.fillRect(700, 378, 20, 30);
	}
	if ((door && level[1]) || level[2]) {
		ctx.strokeStyle = "#FFFFFF";
		drawRect(15, 150, 10, 30);
		drawRect(45, 150, 10, 30);
		drawRect(15, 140, 40, 10);
		if ((!door && level[2]) || (door && level[1])) {
			if (counter < 230) {
				random2 = new Color (counter, counter, counter);
				counter ++;
			}
			else if (counter > 0) {
				random2 = new Color (0, counter, counter);
				counter --;
			}
			//ctx.fillStyle = "rgba(random2.Red,random2.Green,random2.Blue,1)";
			if (level[1]) {
				ctx.fillStyle = "#66FFFF";
			}
			else if (level[2]) {
				ctx.fillStyle = "#FF99CC";
			}
		}
		else if (door && level[2]) {
			ctx.fillStyle = "#222222";
		}
		ctx.fillRect(25, 150, 20, 30);
	}
	if ((door && level[2]) || level[3]) {
		ctx.strokeStyle = "#FFFFFF";
		drawRect(15, 390, 10, 30);
		drawRect(45, 390, 10, 30);
		drawRect(15, 380, 40, 10);
		if ((!door && level[3]) || (door && level[2])) {
			if (counter < 230) {
				random = new Color (counter, counter, counter);
				counter ++;
			}
			else if (counter > 0) {
				random = new Color (counter, counter, 0);
				counter --;
			}
			//ctx.fillStyle = "rgba(random.Red,random.Green,random.Blue,1)";
            if (level[2]) {
                ctx.fillStyle = "#FFFFFF";
            }
            else if (level[3]) {
                ctx.fillStyle = "#66FFFF";
            }
		}
		else if (door && level[3]) {
			ctx.fillStyle = "#222222";
		}
		ctx.fillRect(25, 390, 20, 30);
	}

	// enemy
	for (var i = 0; i < enemy.length; i++) {
		ctx.fillStyle = "#FF0000";
		ctx.strokeStyle = "#FF0000";
		if (enemy[i].deadCounter > 0) {
			drawLine (enemy[i].xpos+4, enemy[i].ypos+7, enemy[i].xpos+tileSize-4, enemy[i].ypos+7);
			drawLine (enemy[i].xpos+4, enemy[i].ypos+7, enemy[i].xpos+4, enemy[i].ypos+tileSize);
		}
		// FALLING
		else if (enemy[i].falling) {
			ctx.fillRect (enemy[i].xpos+4, enemy[i].ypos, tileSize-8, tileSize-10); // head
			ctx.fillRect (enemy[i].xpos+6, enemy[i].ypos+5, 3, 10); // body
			if (enemy[i].fallAnimation <= 10) {
				// arms 1
				drawLine (enemy[i].xpos+2, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos+8);
				drawLine (enemy[i].xpos, enemy[i].ypos+3, enemy[i].xpos+2, enemy[i].ypos+8); // left
				drawLine (enemy[i].xpos+12, enemy[i].ypos+8, enemy[i].xpos+14, enemy[i].ypos+3); // right
				// legs 1
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				drawLine (enemy[i].xpos+2, enemy[i].ypos+19, enemy[i].xpos+4, enemy[i].ypos+16); // left
				drawLine (enemy[i].xpos+4, enemy[i].ypos+16, enemy[i].xpos+6, enemy[i].ypos+15); // left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+15, enemy[i].xpos+11, enemy[i].ypos+16); // right
				drawLine (enemy[i].xpos+11, enemy[i].ypos+16, enemy[i].xpos+13, enemy[i].ypos+19); // right
				
				enemy[i].fallAnimation++;
			}
			else if (enemy[i].fallAnimation <= 20) {
				// arms 2
				ctx.strokeStyle = "#FF0000";
				drawLine (enemy[i].xpos+2, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos+8);
				drawLine (enemy[i].xpos, enemy[i].ypos+13, enemy[i].xpos+2, enemy[i].ypos+8); // left
				drawLine (enemy[i].xpos+12, enemy[i].ypos+8, enemy[i].xpos+14, enemy[i].ypos+13); // right
				// legs 2
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				drawLine (enemy[i].xpos+5, enemy[i].ypos+19, enemy[i].xpos+4, enemy[i].ypos+16); // left
				drawLine (enemy[i].xpos+4, enemy[i].ypos+16, enemy[i].xpos+6, enemy[i].ypos+15); // left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+15, enemy[i].xpos+11, enemy[i].ypos+16); // right
				drawLine (enemy[i].xpos+11, enemy[i].ypos+16, enemy[i].xpos+10, enemy[i].ypos+19); // right
				
				enemy[i].fallAnimation++;
				if (enemy[i].fallAnimation == 20) {
					enemy[i].fallAnimation = 1;
				}
			}
		}
		// BAR RIGHT
		else if (enemy[i].lastDirection == 0 && enemy[i].interact[2]) {
			ctx.fillRect (enemy[i].xpos+4, enemy[i].ypos, tileSize-8, tileSize-10); // head
			ctx.fillRect (enemy[i].xpos+6, enemy[i].ypos+5, 2, 10); // body
			if (enemy[i].barAnimation <= 25) {
				// arms 1
				ctx.strokeStyle = "#FF0000";
				drawLine (enemy[i].xpos+2, enemy[i].ypos+1, enemy[i].xpos+2, enemy[i].ypos+7); // left
				drawLine (enemy[i].xpos+2, enemy[i].ypos+7, enemy[i].xpos+6, enemy[i].ypos+9); // left
				drawLine (enemy[i].xpos+8, enemy[i].ypos+9, enemy[i].xpos+13, enemy[i].ypos+8); // right
				drawLine (enemy[i].xpos+13, enemy[i].ypos+8, enemy[i].xpos+15, enemy[i].ypos); // right
				enemy[i].barAnimation++;
			}
			else if (enemy[i].barAnimation <= 40) {
				// arms 2 
				drawLine (enemy[i].xpos+3, enemy[i].ypos+14, enemy[i].xpos+4, enemy[i].ypos+9); // left                               
				drawLine (enemy[i].xpos+4, enemy[i].ypos+9, enemy[i].xpos+6, enemy[i].ypos+9); // left
				drawLine (enemy[i].xpos+8, enemy[i].ypos+9, enemy[i].xpos+11, enemy[i].ypos+8); // right
				drawLine (enemy[i].xpos+11, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos); //right
				enemy[i].barAnimation++;
				if (enemy[i].barAnimation == 40) {
					enemy[i].barAnimation = 1;
				}
			}
			if (enemy[i].gold) {
				ctx.strokeStyle = "#FFFF00";
			}
			drawLine (enemy[i].xpos+4, enemy[i].ypos+20, enemy[i].xpos+6, enemy[i].ypos+17); // left
			drawLine (enemy[i].xpos+6, enemy[i].ypos+17, enemy[i].xpos+6, enemy[i].ypos+15); // left
			drawLine (enemy[i].xpos+7, enemy[i].ypos+15, enemy[i].xpos+7, enemy[i].ypos+20); // right
		}
		// BAR LEFT
		else if (enemy[i].lastDirection == 1 && enemy[i].interact[2]) {
			ctx.fillRect (enemy[i].xpos+4, enemy[i].ypos, tileSize-8, tileSize-10); // head
			ctx.fillRect (enemy[i].xpos+7, enemy[i].ypos+5, 2, 10); // body
			if (enemy[i].barAnimation <= 25) {
				ctx.strokeStyle = "#FF0000";
				// arms 1 
				drawLine (enemy[i].xpos-1, enemy[i].ypos, enemy[i].xpos+2, enemy[i].ypos+8); // left
				drawLine (enemy[i].xpos+2, enemy[i].ypos+8, enemy[i].xpos+6, enemy[i].ypos+9); // left
				drawLine (enemy[i].xpos+8, enemy[i].ypos+9, enemy[i].xpos+12, enemy[i].ypos+7); // right
				drawLine (enemy[i].xpos+12, enemy[i].ypos+7, enemy[i].xpos+12, enemy[i].ypos+1); // right
				enemy[i].barAnimation++;
			}
			else if (enemy[i].barAnimation <= 40) {
				// arms 2 
				drawLine (enemy[i].xpos+1, enemy[i].ypos, enemy[i].xpos+3, enemy[i].ypos+8); // left
				drawLine (enemy[i].xpos+3, enemy[i].ypos+8, enemy[i].xpos+6, enemy[i].ypos+9); // left
				drawLine (enemy[i].xpos+8, enemy[i].ypos+9, enemy[i].xpos+11, enemy[i].ypos+9); // right
				drawLine (enemy[i].xpos+11, enemy[i].ypos+9, enemy[i].xpos+12, enemy[i].ypos+14); // right
				enemy[i].barAnimation++;
				if (enemy[i].barAnimation == 40) {
					enemy[i].barAnimation = 1;
				}
			}
			if (enemy[i].gold) {
				ctx.strokeStyle = "#FFFF00";
			}
			drawLine (enemy[i].xpos+7, enemy[i].ypos+15, enemy[i].xpos+7, enemy[i].ypos+19); // left
			drawLine (enemy[i].xpos+8, enemy[i].ypos+15, enemy[i].xpos+8, enemy[i].ypos+17); // right
			drawLine (enemy[i].xpos+8, enemy[i].ypos+17, enemy[i].xpos+10, enemy[i].ypos+20); // right
		}
		// WALK RIGHT
		else if (enemy[i].lastDirection == 0) {
			ctx.strokeStyle = "#FF0000";
			ctx.fillRect (enemy[i].xpos+4, enemy[i].ypos, tileSize-8, tileSize-10); // head
			ctx.fillRect (enemy[i].xpos+6, enemy[i].ypos+5, 2, 10); // body
			if (enemy[i].walkAnimation <= 25) {
				// arms 1 
				drawLine (enemy[i].xpos+2, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos+8);
				drawLine (enemy[i].xpos+2, enemy[i].ypos+8, enemy[i].xpos+2, enemy[i].ypos+11); // left
				drawLine (enemy[i].xpos+12, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos+5); // right
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				// legs 1
				drawLine(enemy[i].xpos+5, enemy[i].ypos+18, enemy[i].xpos+6, enemy[i].ypos+15); // left
				drawLine(enemy[i].xpos+8, enemy[i].ypos+15, enemy[i].xpos+9, enemy[i].ypos+18); // right
				enemy[i].walkAnimation++;
			}
			else if (enemy[i].walkAnimation <= 50) {
				ctx.strokeStyle = "#FF0000";
				// arms 2 
				drawLine (enemy[i].xpos+2, enemy[i].ypos+10, enemy[i].xpos+4, enemy[i].ypos+12); // left                              
				drawLine (enemy[i].xpos+2, enemy[i].ypos+10, enemy[i].xpos+6, enemy[i].ypos+8); // left
				drawLine (enemy[i].xpos+8, enemy[i].ypos+8, enemy[i].xpos+10, enemy[i].ypos+10); // right
				drawLine (enemy[i].xpos+10, enemy[i].ypos+10, enemy[i].xpos+12, enemy[i].ypos+8); //right
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				// legs 2
				drawLine(enemy[i].xpos+3, enemy[i].ypos+18, enemy[i].xpos+6, enemy[i].ypos+15); // left
				drawLine(enemy[i].xpos+7, enemy[i].ypos+15, enemy[i].xpos+10, enemy[i].ypos+18); // right
				enemy[i].walkAnimation++;
				if (enemy[i].walkAnimation == 50) {
					enemy[i].walkAnimation = 1;
				}
			}
		}
		// WALK LEFT
		else if (enemy[i].lastDirection == 1) {
			ctx.strokeStyle = "#FF0000";
			ctx.fillRect (enemy[i].xpos+4, enemy[i].ypos, tileSize-8, tileSize-10); // head
			ctx.fillRect (enemy[i].xpos+7, enemy[i].ypos+5, 2, 10); // body
			if (enemy[i].walkAnimation <= 25) {
				// arms 1 
				drawLine (enemy[i].xpos+2, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos+8);
				drawLine (enemy[i].xpos+2, enemy[i].ypos+5, enemy[i].xpos+2, enemy[i].ypos+8); // left
				drawLine (enemy[i].xpos+12, enemy[i].ypos+8, enemy[i].xpos+12, enemy[i].ypos+11); // right
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				// legs 1
				drawLine (enemy[i].xpos+6, enemy[i].ypos+18, enemy[i].xpos+7, enemy[i].ypos+15); // left
				drawLine (enemy[i].xpos+8, enemy[i].ypos+15, enemy[i].xpos+9, enemy[i].ypos+18); // right
				enemy[i].walkAnimation++;
			}
			else if (enemy[i].walkAnimation <= 50) {
				ctx.strokeStyle = "#FF0000";
				// arms 2 
				drawLine (enemy[i].xpos+1, enemy[i].ypos+8, enemy[i].xpos+4, enemy[i].ypos+11); // left
				drawLine (enemy[i].xpos+4, enemy[i].ypos+11, enemy[i].xpos+7, enemy[i].ypos+7); // left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+7, enemy[i].xpos+13, enemy[i].ypos+9); // right
				drawLine (enemy[i].xpos+13, enemy[i].ypos+9, enemy[i].xpos+10, enemy[i].ypos+13); // right
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				// legs 2
				drawLine(enemy[i].xpos+4, enemy[i].ypos+18, enemy[i].xpos+7, enemy[i].ypos+15); // left
				drawLine(enemy[i].xpos+8, enemy[i].ypos+15, enemy[i].xpos+11, enemy[i].ypos+18); // right
				enemy[i].walkAnimation++;
				if (enemy[i].walkAnimation == 50) {
					enemy[i].walkAnimation = 1;
				}
			}
		}
		// GO DOWN OR UP
		else if (enemy[i].lastDirection == 3 || enemy[i].lastDirection == 2) {
			ctx.strokeStyle = "#FF0000";
			ctx.fillRect (enemy[i].xpos+4, enemy[i].ypos, tileSize-8, tileSize-10); // head
			ctx.fillRect (enemy[i].xpos+6, enemy[i].ypos+5, 3, 10); // body
			// arms 1
			if (enemy[i].ladderAnimation <= 20) {
				drawLine (enemy[i].xpos+1, enemy[i].ypos, enemy[i].xpos+1, enemy[i].ypos+5); // left
				drawLine (enemy[i].xpos+1, enemy[i].ypos+5, enemy[i].xpos+6, enemy[i].ypos+7); // left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+7, enemy[i].xpos+13, enemy[i].ypos+7); // right
				drawLine (enemy[i].xpos+13, enemy[i].ypos+7, enemy[i].xpos+13, enemy[i].ypos+3); // right
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				// legs 1
				drawLine (enemy[i].xpos+2, enemy[i].ypos+19, enemy[i].xpos+2, enemy[i].ypos+16); //left
				drawLine (enemy[i].xpos+2, enemy[i].ypos+16, enemy[i].xpos+6, enemy[i].ypos+15); //left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+14, enemy[i].xpos+13, enemy[i].ypos+13); //right
				drawLine (enemy[i].xpos+13, enemy[i].ypos+13, enemy[i].xpos+13, enemy[i].ypos+15); // right
				enemy[i].ladderAnimation ++;
			}
			else if (enemy[i].ladderAnimation <= 40) {
				ctx.strokeStyle = "#FF0000";
				// arms 2
				drawLine (enemy[i].xpos+1, enemy[i].ypos+3, enemy[i].xpos+1, enemy[i].ypos+7); // left
				drawLine (enemy[i].xpos+1, enemy[i].ypos+7, enemy[i].xpos+6, enemy[i].ypos+7); // left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+7, enemy[i].xpos+14, enemy[i].ypos+5); // right
				drawLine (enemy[i].xpos+14, enemy[i].ypos+5, enemy[i].xpos+14, enemy[i].ypos); // right
				if (enemy[i].gold) {
					ctx.strokeStyle = "#FFFF00";
				}
				// legs 2
				drawLine (enemy[i].xpos+1, enemy[i].ypos+16, enemy[i].xpos+1, enemy[i].ypos+13); // left
				drawLine (enemy[i].xpos+1, enemy[i].ypos+13, enemy[i].xpos+6, enemy[i].ypos+14); // left
				drawLine (enemy[i].xpos+9, enemy[i].ypos+14, enemy[i].xpos+12, enemy[i].ypos+16); // right
				drawLine (enemy[i].xpos+12, enemy[i].ypos+16, enemy[i].xpos+12, enemy[i].ypos+19); // right
				enemy[i].ladderAnimation++;
				if (enemy[i].ladderAnimation == 40) {
					enemy[i].ladderAnimation = 1;
				}
			}
		}
	}

	// player
    if (level[3]) {
        ctx.fillStyle = "#FF0000";
        ctx.strokeStyle = "#FF0000";
    }
    else {
	   ctx.fillStyle = "#FFFFFF";
	   ctx.strokeStyle = "#FFFFFF";
    }
	// FALLING
	if (player.falling) {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+6, player.ypos+5, 3, 10); // body
		if (player.fallAnimation <= 10) {
			// arms 1
			drawLine (player.xpos+2, player.ypos+8, player.xpos+12, player.ypos+8);
			drawLine (player.xpos, player.ypos+3, player.xpos+2, player.ypos+8); // left
			drawLine (player.xpos+12, player.ypos+8, player.xpos+14, player.ypos+3); // right
			// legs 1
			drawLine (player.xpos+2, player.ypos+19, player.xpos+4, player.ypos+16); // left
			drawLine (player.xpos+4, player.ypos+16, player.xpos+6, player.ypos+15); // left
			drawLine (player.xpos+9, player.ypos+15, player.xpos+11, player.ypos+16); // right
			drawLine (player.xpos+11, player.ypos+16, player.xpos+13, player.ypos+19); // right
			
			player.fallAnimation++;
		}
		else if (player.fallAnimation <= 20) {
			// arms 2
			drawLine (player.xpos+2, player.ypos+8, player.xpos+12, player.ypos+8);
			drawLine (player.xpos, player.ypos+13, player.xpos+2, player.ypos+8); // left
			drawLine (player.xpos+12, player.ypos+8, player.xpos+14, player.ypos+13); // right
			// legs 2
			drawLine (player.xpos+5, player.ypos+19, player.xpos+4, player.ypos+16); // left
			drawLine (player.xpos+4, player.ypos+16, player.xpos+6, player.ypos+15); // left
			drawLine (player.xpos+9, player.ypos+15, player.xpos+11, player.ypos+16); // right
			drawLine (player.xpos+11, player.ypos+16, player.xpos+10, player.ypos+19); // right
			
			player.fallAnimation++;
			if (player.fallAnimation == 20) {
				player.fallAnimation = 1;
			}
		}
	}
	// BAR RIGHT
	else if (player.lastDirection == 0 && player.interact[2]) {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+6, player.ypos+5, 2, 10); // body
		drawLine (player.xpos+4, player.ypos+20, player.xpos+6, player.ypos+17); // left
		drawLine (player.xpos+6, player.ypos+17, player.xpos+6, player.ypos+15); // left
		drawLine (player.xpos+7, player.ypos+15, player.xpos+7, player.ypos+20); // right
		if (player.moving[0]) {
			if (player.barAnimation <= 25) {
				// arms 1 
				drawLine (player.xpos+2, player.ypos+1, player.xpos+2, player.ypos+7); // left
				drawLine (player.xpos+2, player.ypos+7, player.xpos+6, player.ypos+9); // left
				drawLine (player.xpos+8, player.ypos+9, player.xpos+13, player.ypos+8); // right
				drawLine (player.xpos+13, player.ypos+8, player.xpos+15, player.ypos); // right
				player.barAnimation++;
			}
			else if (player.barAnimation <= 40) {
				// arms 2 
				drawLine (player.xpos+3, player.ypos+14, player.xpos+4, player.ypos+9); // left                           
				drawLine (player.xpos+4, player.ypos+9, player.xpos+6, player.ypos+9); // left
				drawLine (player.xpos+8, player.ypos+9, player.xpos+11, player.ypos+8); // right
				drawLine (player.xpos+11, player.ypos+8, player.xpos+12, player.ypos); //right
				player.barAnimation++;
				if (player.barAnimation == 40) {
					player.barAnimation = 1;
				}
			}
		}
		else {
			drawLine (player.xpos+2, player.ypos+1, player.xpos+2, player.ypos+7); // left
			drawLine (player.xpos+2, player.ypos+7, player.xpos+6, player.ypos+9); // left
			drawLine (player.xpos+8, player.ypos+9, player.xpos+13, player.ypos+8); // right
			drawLine (player.xpos+13, player.ypos+8, player.xpos+15, player.ypos); // right
		}
		
	}
	// BAR LEFT
	else if (player.lastDirection == 1 && player.interact[2]) {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+7, player.ypos+5, 2, 10); // body
		drawLine (player.xpos+7, player.ypos+15, player.xpos+7, player.ypos+19); // left
		drawLine (player.xpos+8, player.ypos+15, player.xpos+8, player.ypos+17); // right
		drawLine (player.xpos+8, player.ypos+17, player.xpos+10, player.ypos+20); // right
		if (player.moving[1]) {
			if (player.barAnimation <= 25) {
				// arms 1 
				drawLine (player.xpos-1, player.ypos, player.xpos+2, player.ypos+8); // left
				drawLine (player.xpos+2, player.ypos+8, player.xpos+6, player.ypos+9); // left
				drawLine (player.xpos+8, player.ypos+9, player.xpos+12, player.ypos+7); // right
				drawLine (player.xpos+12, player.ypos+7, player.xpos+12, player.ypos+1); // right
				player.barAnimation++;
			}
			else if (player.barAnimation <= 40) {
				// arms 2 
				drawLine (player.xpos+1, player.ypos, player.xpos+3, player.ypos+8); // left
				drawLine (player.xpos+3, player.ypos+8, player.xpos+6, player.ypos+9); // left
				drawLine (player.xpos+8, player.ypos+9, player.xpos+11, player.ypos+9); // right
				drawLine (player.xpos+11, player.ypos+9, player.xpos+12, player.ypos+14); // right
				player.barAnimation++;
				if (player.barAnimation == 40) {
					player.barAnimation = 1;
				}
			}
		}
		else {
			drawLine (player.xpos-1, player.ypos, player.xpos+2, player.ypos+8); // left
			drawLine (player.xpos+2, player.ypos+8, player.xpos+6, player.ypos+9); // left
			drawLine (player.xpos+8, player.ypos+9, player.xpos+12, player.ypos+7); // right
			drawLine (player.xpos+12, player.ypos+7, player.xpos+12, player.ypos+1); // right
		}
	}
	// WALK RIGHT
	else if (player.lastDirection == 0) {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+6, player.ypos+5, 2, 10); // body
		if (player.moving[0]) {
			if (player.walkAnimation <= 25) {
				// arms 1 
				drawLine (player.xpos+2, player.ypos+8, player.xpos+12, player.ypos+8);
				drawLine (player.xpos+2, player.ypos+8, player.xpos+2, player.ypos+11); // left
				drawLine (player.xpos+12, player.ypos+8, player.xpos+12, player.ypos+5); // right
				// legs 1
				
				drawLine(player.xpos+5, player.ypos+18, player.xpos+6, player.ypos+15); // left
				drawLine(player.xpos+7, player.ypos+15, player.xpos+8, player.ypos+18); // right
				player.walkAnimation++;
			}
			else if (player.walkAnimation <= 50) {
				// arms 2 
				drawLine (player.xpos+2, player.ypos+10, player.xpos+4, player.ypos+12); // left                          
				drawLine (player.xpos+2, player.ypos+10, player.xpos+6, player.ypos+8); // left
				drawLine (player.xpos+8, player.ypos+8, player.xpos+10, player.ypos+10); // right
				drawLine (player.xpos+10, player.ypos+10, player.xpos+12, player.ypos+8); //right
				// legs 2
				drawLine(player.xpos+3, player.ypos+18, player.xpos+6, player.ypos+15); // left
				drawLine(player.xpos+7, player.ypos+15, player.xpos+10, player.ypos+18); // right
				player.walkAnimation++;
				if (player.walkAnimation == 50) {
					player.walkAnimation = 1;
				}
			}
		}
		else {
			drawLine (player.xpos+2, player.ypos+10, player.xpos+4, player.ypos+12); // left                          
			drawLine (player.xpos+2, player.ypos+10, player.xpos+6, player.ypos+8); // left
			drawLine (player.xpos+8, player.ypos+8, player.xpos+10, player.ypos+10); // right
			drawLine (player.xpos+10, player.ypos+10, player.xpos+12, player.ypos+8); //right
			drawLine(player.xpos+5, player.ypos+18, player.xpos+6, player.ypos+15); // left
			drawLine(player.xpos+7, player.ypos+15, player.xpos+8, player.ypos+18); // right
		}
	}
	// WALK LEFT
	else if (player.lastDirection == 1) {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+7, player.ypos+5, 2, 10); // body
		if (player.moving[1]) {
			if (player.walkAnimation <= 25) {
				// arms 1 
				drawLine (player.xpos+2, player.ypos+8, player.xpos+12, player.ypos+8);
				drawLine (player.xpos+2, player.ypos+5, player.xpos+2, player.ypos+8); // left
				drawLine (player.xpos+12, player.ypos+8, player.xpos+12, player.ypos+11); // right
				// legs 1
				drawLine (player.xpos+6, player.ypos+18, player.xpos+7, player.ypos+15); // left
				drawLine (player.xpos+8, player.ypos+15, player.xpos+9, player.ypos+18); // right
				player.walkAnimation++;
			}
			else if (player.walkAnimation <= 50) {
				// arms 2 
				drawLine (player.xpos+1, player.ypos+8, player.xpos+4, player.ypos+11); // left
				drawLine (player.xpos+4, player.ypos+11, player.xpos+7, player.ypos+7); // left
				drawLine (player.xpos+9, player.ypos+7, player.xpos+13, player.ypos+9); // right
				drawLine (player.xpos+13, player.ypos+9, player.xpos+10, player.ypos+13); // right
				
				// legs 2
				drawLine(player.xpos+4, player.ypos+18, player.xpos+7, player.ypos+15); // left
				drawLine(player.xpos+8, player.ypos+15, player.xpos+11, player.ypos+18); // right
				player.walkAnimation++;
				if (player.walkAnimation == 50) {
					player.walkAnimation = 1;
				}
			}
		}
		else {
			drawLine (player.xpos+1, player.ypos+8, player.xpos+4, player.ypos+11); // left
			drawLine (player.xpos+4, player.ypos+11, player.xpos+7, player.ypos+7); // left
			drawLine (player.xpos+9, player.ypos+7, player.xpos+13, player.ypos+9); // right
			drawLine (player.xpos+13, player.ypos+9, player.xpos+10, player.ypos+13); // right
			drawLine (player.xpos+6, player.ypos+18, player.xpos+7, player.ypos+15); // left
			drawLine (player.xpos+8, player.ypos+15, player.xpos+9, player.ypos+18); // right
		}
	}
	// GO DOWN OR UP
	else if ((player.lastDirection == 3 || player.lastDirection == 2) && player.interact[3]) {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+6, player.ypos+5, 3, 10); // body
		if (player.moving[2] || player.moving[3]) {
			if (player.ladderAnimation <= 20) {
				// arms 1
				drawLine (player.xpos+1, player.ypos, player.xpos+1, player.ypos+5); // left
				drawLine (player.xpos+1, player.ypos+5, player.xpos+6, player.ypos+7); // left
				drawLine (player.xpos+9, player.ypos+7, player.xpos+13, player.ypos+7); // right
				drawLine (player.xpos+13, player.ypos+7, player.xpos+13, player.ypos+3); // right
				// legs 1
				drawLine (player.xpos+2, player.ypos+19, player.xpos+2, player.ypos+16); //left
				drawLine (player.xpos+2, player.ypos+16, player.xpos+6, player.ypos+15); //left
				drawLine (player.xpos+9, player.ypos+14, player.xpos+13, player.ypos+13); //right
				drawLine (player.xpos+13, player.ypos+13, player.xpos+13, player.ypos+15); // right
				player.ladderAnimation ++;
			}
			else if (player.ladderAnimation <= 40) {
				// arms 2
				drawLine (player.xpos+1, player.ypos+3, player.xpos+1, player.ypos+7); // left
				drawLine (player.xpos+1, player.ypos+7, player.xpos+6, player.ypos+7); // left
				drawLine (player.xpos+9, player.ypos+7, player.xpos+14, player.ypos+5); // right
				drawLine (player.xpos+14, player.ypos+5, player.xpos+14, player.ypos); // right
				// legs 2
				drawLine (player.xpos+1, player.ypos+16, player.xpos+1, player.ypos+13); // left
				drawLine (player.xpos+1, player.ypos+13, player.xpos+6, player.ypos+14); // left
				drawLine (player.xpos+9, player.ypos+14, player.xpos+12, player.ypos+16); // right
				drawLine (player.xpos+12, player.ypos+16, player.xpos+12, player.ypos+19); // right
				player.ladderAnimation++;
				if (player.ladderAnimation == 40) {
					player.ladderAnimation = 1;
				}
			}
		}
		else {
			drawLine (player.xpos+1, player.ypos, player.xpos+1, player.ypos+5); // left
			drawLine (player.xpos+1, player.ypos+5, player.xpos+6, player.ypos+7); // left
			drawLine (player.xpos+9, player.ypos+7, player.xpos+13, player.ypos+7); // right
			drawLine (player.xpos+13, player.ypos+7, player.xpos+13, player.ypos+3); // right
			drawLine (player.xpos+2, player.ypos+19, player.xpos+2, player.ypos+16); //left
			drawLine (player.xpos+2, player.ypos+16, player.xpos+6, player.ypos+15); //left
			drawLine (player.xpos+9, player.ypos+14, player.xpos+13, player.ypos+13); //right
			drawLine (player.xpos+13, player.ypos+13, player.xpos+13, player.ypos+15); // right
		}
	}
	else {
		ctx.fillRect (player.xpos+4, player.ypos, tileSize-8, tileSize-10); // head
		ctx.fillRect (player.xpos+6, player.ypos+5, 2, 10); // body
		drawLine (player.xpos+2, player.ypos+10, player.xpos+4, player.ypos+12); // left                          
		drawLine (player.xpos+2, player.ypos+10, player.xpos+6, player.ypos+8); // left
		drawLine (player.xpos+8, player.ypos+8, player.xpos+10, player.ypos+10); // right
		drawLine (player.xpos+10, player.ypos+10, player.xpos+12, player.ypos+8); //right
		drawLine(player.xpos+5, player.ypos+18, player.xpos+6, player.ypos+15); // left
		drawLine(player.xpos+7, player.ypos+15, player.xpos+8, player.ypos+18); // right
	}

    ctx.fillText("Lives: "+player.lives,5,10);
    ctx.fillText("Score: "+player.score,50,10);
    ctx.fillText("Pitfalls Remaining: "+(player.MAXSHOTS-player.shots),110,10);
};

drawLine = function (x1,y1,x2,y2) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.closePath();
	ctx.stroke();
};

drawRect = function (x1,y1,x2,y2) {
	ctx.beginPath();
	ctx.rect(x1,y1,x2,y2);
	ctx.closePath();
	ctx.stroke();
};

drawCircle = function (x1,y1,r) {
	ctx.beginPath();
	ctx.arc(x1,y1,r,0,2*Math.PI);
	ctx.closePath();
	ctx.stroke();
};

fillCircle = function (x1,y1,r) {
	ctx.beginPath();
	ctx.arc(x1,y1,r,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
};

drawPoly4 = function (a,a_,b,b_,c,c_,d,d_) {
	poly=[ a,a_, b,b_, c,c_, d,d_ ];
	ctx.beginPath();
	ctx.moveTo(poly[0], poly[1]);
	for( item=2 ; item < poly.length-1 ; item+=2 ){ctx.lineTo( poly[item] , poly[item+1] )}
	ctx.closePath();
	ctx.stroke();
}

fillPoly4 = function (a,a_,b,b_,c,c_,d,d_) {
	poly=[a,a_, b,b_, c,c_, d,d_ ];
	ctx.beginPath();
	ctx.moveTo(poly[0], poly[1]);
	for( item=2 ; item < poly.length-1 ; item+=2 ){ctx.lineTo( poly[item] , poly[item+1] )}
	ctx.closePath();
	ctx.fill();
}

drawStar = function (a,a_,b,b_,c,c_,d,d_,e,e_,f,f_,g,g_,h,h_,i,i_,j,j_,k,k_) {
	poly=[a,a_,b,b_,c,c_,d,d_,e,e_,f,f_,g,g_,h,h_,i,i_,j,j_,k,k_];
	ctx.moveTo(poly[0], poly[1]);
	for( item=2 ; item < poly.length-1 ; item+=2 ){ctx.lineTo( poly[item] , poly[item+1] )}
	ctx.closePath();
	ctx.stroke();
}

fillStar = function (a,a_,b,b_,c,c_,d,d_,e,e_,f,f_,g,g_,h,h_,i,i_,j,j_,k,k_) {
	poly=[a,a_,b,b_,c,c_,d,d_,e,e_,f,f_,g,g_,h,h_,i,i_,j,j_,k,k_];
	ctx.moveTo(poly[0], poly[1]);
	for( item=2 ; item < poly.length-1 ; item+=2 ){ctx.lineTo( poly[item] , poly[item+1] )}
	ctx.closePath();
	ctx.fill();
}
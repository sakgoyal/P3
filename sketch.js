p5.disableFriendlyErrors = true; // disables FES to increase performance
function keyPressed() {
	keyArray[keyCode] = 1;
	if (key === " " && numBullets > 0 && !title) {
		bul = new bulletStates(player.x, player.y, radians(playerAngle));
		numBullets--; //decrement number of bullets left
	}
} 
function keyReleased() {
	keyArray[keyCode] = 0;
}
function preload() {
	spritesheet = loadImage("WeaponCrypt.png"); //load spritesheet
	walltexture = loadImage("walls.png"); //load wall texture
	explosion = loadImage("explosion.png"); //load explosion spritesheet
}
function setup() {
	createCanvas(400, 400);
	//items are 20 pixels tall
	//items are 20 pixels wide
	//push items into the 2d tilemap
	walls = [];
	rocks = [];
	prizes = [];
	enemies = [];
	ammoBox = [];
	translateX = 0;
	translateY = 0;
	killCount = 0;
	for (let i = 0; i < 42; i++) {
		for (let j = 0; j < 42; j++) { 
			if (map2[j][i] === " ") continue; //if the tile is empty, skip it
			else if (map2[j][i] === "c") player = new Tile(i * 20, j * 20, 20, 20, "c"); //player
			else if (map2[j][i] === "w") walls.push(new Tile(i * 20, j * 20, 20, 20, "w")); //wall
			else if (map2[j][i] === "r") rocks.push(new Tile(i * 20, j * 20, 20, 20, "r")); //rock
			else if (map2[j][i] === "p") prizes.push(new Tile(i * 20, j * 20, 20, 20, "p")); //prize
			else if (map2[j][i] === "e") enemies.push(new Tile(i * 20, j * 20, 20, 20, "e"));	//enemy
			else if (map2[j][i] === "a") ammoBox.push(new Tile(i * 20, j * 20, 20, 20, "a")); //ammo box
		}
	}
}
function gameOverScreen() {
	text("Game Over", 100, 200);
	if (keyArray[32] === 1) {
		//if spacebar is pressed restart the game
		gameOver = false;
		setup();
	}
}
function gameWinScreen() {
	winRotate -= 0.05;
	push();
	textAlign(CENTER);
	textSize(32);
	translate(width / 2, height / 2); //move to the center of the screen, so the text is centered and rotate the text around the center
	rotate(winRotate);
	text("You Win!", 0, 0);

	if (keyArray[32] === 1) {
		//if spacebar is pressed restart the game
		gameWin = false;
		setup();
	}
	pop();
}
function showTitle() {
	push();
	background(0);
	textSize(32);
	fill(255);
	textAlign(CENTER);
	text("Weapon Crypt", width / 2, height / 2 - 50);
	textSize(16);
	text("Press Space to Start", width / 2, height / 2);
	// show the controls
	textSize(12);
	text("Controls:", width / 2, height / 2 + 50);
	text("WASD or Arrow Keys to move", width / 2, height / 2 + 70);
	text("Space to shoot", width / 2, height / 2 + 90);
	image(getSprite(3, 3), width / 2 - 32, height / 2 + 100, 64, 64);
	if (keyArray[32] === 1) title = false;
	pop();
}
function draw() {
	background(100, 140, 0); //draw background color (green)
	noStroke();
	if (title) return showTitle();
	if (gameOver) gameOverScreen(); //if the game is over, show the game over screen
	if (gameWin) return gameWinScreen(); //if the game is won, show the game win screen
	noFill();
	moveEnemies(); //move the enemies in the wander state or the chase state depending on the distance to the player
	for (let i = 0; i < enemies.length; i++) {
		if (rectIntersect(player, enemies[i])) gameOver = true; //if the player collides with an enemy, the game is over
	}
	if (!gameOver) playermove(); //if the game is not over, move the player with the arrow keys or WASD
	image(walltexture, translateX, translateY, 800, 840); //draw the border texture
	for (var roc of rocks) roc.show(); //draw the rocks
	for (var pri of prizes) pri.show(); //draw the prizes
	for (var box in ammoBox) ammoBox[box].show(); //draw the ammo boxes
	player.show(); //draw the player
	for (var ene of enemies) ene.show(); //draw the enemies
	textSize(20);
	fill(0);
	text("Prizes Left: " + prizes.length, 10, 20); //draw the number of prizes left
	text("Ammo: " + numBullets, 10, 40); //draw the number of bullets left
	if (ex) ex.show(); //draw the explosion if there is one
	if (bul) bul.show(); //draw the bullet if there is one
}
var title = true;
var winRotate = 0;
var playerAngle = 0;
var keyArray = [];
var translateX = 0;
var translateY = 0;
var spritesheet;
var enemies = [];
var walls = [];
var rocks = [];
var prizes = [];
var ammoBox = [];
var player;
var walltexture;
var gameOver = false;
var gameWin = false;
var explosion;
var ex;
var bul;
var numBullets = 2;
const enemyspeed = 1.6;
const playerspeed = 2;
const map2 = [
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
	"wp           r     r                   w",
	"w                            r         w",
	"w         r        e              p    w",
	"w   r                            r     w",
	"w         a        r                   w",
	"w     r   p               r            w",
	"w                   r                  w",
	"w                               p      w",
	"w        r        r                    w",
	"w         c               r      r     w",
	"w    r                                 w",
	"w                 r     p         r    w",
	"w          r             r             w",
	"w                    a         r  e    w",
	"w       p                          p   w",
	"w   e                                  w",
	"w            r    r       p            w",
	"w                                 r    w",
	"w        p                             w",
	"w                r                     w",
	"w                        r     p       w",
	"w  p                r                  w",
	"w          r      r p e   r            w",
	"w                                  r   w",
	"w             r             r          w",
	"w     r p               r              w",
	"w                r                     w",
	"w           r                    r     w",
	"w                       p              w",
	"w     p                           r    w",
	"w               a     r                w",
	"w       r                    r         w",
	"w                       r              w",
	"w      r    p                          w",
	"w                   r         p        w",
	"w                                   r  w",
	"w       r       r    p                 w",
	"w   e   p                   e          w",
	"w              r       r      p     r  w",
	"w                                      w",
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
];
function getSprite(x, y) {
	const imgr = 16;
	return spritesheet.get(x * imgr, y * imgr, imgr, imgr); //get a sprite from the spritesheet at the given x and y coordinates
}
function distSquared(x1, y1, x2, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	return dx * dx + dy * dy; //calculate the distance between two points squared (faster than calculating the actual distance)
}
function playermove() {
	let forward;
	if (keyArray[87] === 1 || keyArray[UP_ARROW] === 1) forward = 1; //if W or up arrow is pressed, move forward
	else if (keyArray[83] === 1 || keyArray[DOWN_ARROW] === 1) forward = -1; //if S or down arrow is pressed, move backward
	keyArray[65] === 1 || keyArray[LEFT_ARROW] ? (playerAngle -= 2) : playerAngle;
	keyArray[68] === 1 || keyArray[RIGHT_ARROW] ? (playerAngle += 2) : playerAngle;
	if (forward) {
		movePlayer(cos(radians(playerAngle)) * playerspeed * forward, sin(radians(playerAngle)) * playerspeed * forward); //move the player horizontally
		// movePlayer(0, ); //move the player vertically
	}
}
function rectIntersect(r1, r2) {
	//check if two rectangles intersect (used to check collisions)
	if (r1.x >= r2.x + r2.w || r2.x >= r1.x + r1.w) return false; // no horizontal overlap
	if (r1.y >= r2.y + r2.h || r2.y >= r1.y + r1.h) return false; // no vertical overlap
	return true; // if the above statements are not true, there is an overlap
}
function movePlayer(x, y) {
	const newPos = { x: player.x + x, y: player.y + y, w: 20, h: 20 }; //get the location of the intended move
	for (let i = 0; i < rocks.length; i++) {
		//check if the player collides with a rock
		if (rectIntersect(newPos, rocks[i])) {
			// make the player bounce back if they hit a rock
			player.x -= 3 * x;
			player.y -= 3 * y;
			return;
		}
	}
	for (let i = 0; i < prizes.length; i++) {
		//check if the player collides with a prize
		if (rectIntersect(newPos, prizes[i])) {
			prizes.splice(i, 1); //remove the prize from the array
			i--;
			gameWin = prizes.length === 0; //check if the player has won the game (if there are no prizes left)
		}
	}
	for (let i = 0; i < ammoBox.length; i++) {
		//check if the player collides with an ammo box
		if (rectIntersect(newPos, ammoBox[i])) {
			ammoBox.splice(i, 1); //remove the ammo box from the array
			numBullets++; //add a bullet to the player's ammo
		}
	}
	player.x = Math.max(20, Math.min(760, newPos.x)); // limit the player's x position to the screen
	player.y = Math.max(20, Math.min(800, newPos.y)); // limit the player's y position to the screen

	const cameraMargin = 150; //the distance from the edge of the screen that the camera will start moving
	if (player.x + translateX < cameraMargin) translateX += playerspeed; //move the camera left if the player is too far left
	else if (player.x + translateX > width - cameraMargin) translateX -= playerspeed;
	if (player.y + translateY < cameraMargin) translateY += playerspeed; //move the camera up if the player is too far up
	else if (player.y + translateY > height - cameraMargin) translateY -= playerspeed;
}
function moveEnemies() {
	var enemyRange = 100; //the distance from the player that the enemies will start moving towards the player
	for (let enemy of enemies) {
		let rotatedi = enemy.x > player.x ? enemyspeed : -enemyspeed; //if the enemy is to the right of the player, move right, otherwise move left
		let ydist = enemy.y < player.y ? enemyspeed : -enemyspeed;
		// for each enemy, if the player is in the range of the enemy, move towards the player
		if (distSquared(enemy.x, enemy.y, player.x, player.y) > enemyRange ** 2) {
			//if the player is not in range, wander around randomly
			enemy.enemyrotateoffset = 0;
			enemy.enemybounceoffset = 0;
			if (enemy.wanderFrames > 0) {
				// check if the enemy should wander around or not
				enemy.wanderFrames--;
				enemy.x = Math.max(20, Math.min(760, enemy.x + enemy.wanderDir.x)); // limit the enemy's x position to the screen
				enemy.y = Math.max(20, Math.min(800, enemy.y + enemy.wanderDir.y));
				for (let i = 0; i < rocks.length; i++) {
					if (rectIntersect(enemy, rocks[i])) {
						// if the enemy hits a rock, make it bounce back
						enemy.x += 3 * rotatedi;
						enemy.y -= 3 * ydist;
						return;
					}
				}
			} else {
				// if the enemy has finished wandering, pick a new direction to wander in and how long to wander for randomly in frames
				enemy.wanderFrames = random(60, 120);
				enemy.wanderDir = p5.Vector.random2D().mult(0.2 * enemyspeed);
			}
			continue; // skip the rest of the code for this enemy since it is not in range
		}

		if (Math.abs(enemy.x - player.x) >= Math.abs(enemy.y - player.y)) enemy.x -= rotatedi; //move horizontally first (horizontal priority)
		else enemy.y += ydist;

		for (let i = 0; i < rocks.length; i++) {
			if (rectIntersect(enemy, rocks[i])) {
				// if the enemy hits a rock, make it bounce back
				enemy.x += 3 * rotatedi;
				enemy.y -= 3 * ydist;
				return;
			}
		}
		enemy.enemybounceoffset = Math.abs(Math.sin(frameCount / 4)) * 5; // make the enemy bounce up and down slightly
		enemy.enemyrotateoffset = 0.1 * rotatedi * Math.abs(Math.sin(frameCount / 4)); // make the enemy rotate slightly
	}
}
class Tile {
	constructor(x, y, w, h, type) {
		// set up the map which tells us what tiles to draw
		// '' = empty
		// 'w' = wall
		// 'c' = character/player
		// 'e' = enemy
		// 'p' = prize
		// 'r' = rock
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.type = type; // the type of tile this is (see above)
		this.pindex = [int(random(3, 5)), int(random(2))]; //random index for the prize image
		this.enemybounceoffset = 0; //the amount the enemy should bounce up and down
		this.enemyrotateoffset = 0; //the amount the enemy should rotate
		this.wanderFrames = 3 * frameRate; //how many frames the enemy should wander for in seconds
		this.direction = p5.Vector.fromAngle(0); //the direction the enemy should wander in
	}
	show() {
		push();
		translate(translateX, translateY); //move the camera
		if (this.type == "c") {
			push();
			translate(this.x, this.y);
			rotate(radians(playerAngle + 90));
			this.numtracks = 15;
			this.wheelw = this.w / 4;
			this.gunlen = 10;
			push();
			fill(103, 140, 199);
			rect(-this.w / 2, -this.h / 2, this.w, this.h);
			for (let i = int(-this.h / 2); i < 1 + this.h / 2; i += int(this.h / this.numtracks)) {
				i % 2 == 0 ? fill(0) : fill(81, 81, 81);
				rect(-2 * this.wheelw, i, this.wheelw, this.h / this.numtracks);
				rect(+2 * this.wheelw, i, this.wheelw, this.h / this.numtracks);
			}
			fill(50, 100, 200);
			rect(0, -this.h / 1.5, this.w / 10, this.gunlen, 3);
			rect(0, 0, this.w / 2, this.h / 2, 10);
			pop();
			pop();
		} else if (this.type == "e") {
			//if the tile is an enemy
			push();
			translate(this.x, this.y);
			if (!gameOver) rotate(this.enemyrotateoffset);
			image(getSprite(1, 0), 0, -this.enemybounceoffset, 20, 20); //enemy
			pop();
		} else if (this.type == "r") {
			//if the tile is a rock
			image(getSprite(4, 3), this.x, this.y, 20, 20); //rock
		} else if (this.type == "p") {
			//if the tile is a prize
			image(getSprite(this.pindex[0], this.pindex[1]), this.x, this.y, 20, 20); //prize
		} else if (this.type == "a") {
			//if the tile is an ammo crate
			image(getSprite(4, 2), this.x, this.y, 20, 20); // ammo  crate
		}
		pop();
	}
}
class explosionStates {
	//the different states of the explosion
	constructor(x, y, dir) {
		this.x = x;
		this.y = y;
		this.pos = 0; //the current position of the explosion animation
	}
	show() {
		push();
		translate(translateX, translateY);
		image(explosion.get(40 * int(this.pos), 0, 40, 37), this.x, this.y - 10, 20, 20); //explosion
		pop();
		this.pos += 0.2; //increment the position of the explosion animation
	}
}
class bulletStates {
	constructor(x, y, dir) {
		this.dir = dir;
		this.x = x;
		this.y = y;
		this.direction = p5.Vector.fromAngle(this.dir).mult(5); //the direction the bullet should move in
		this.w = 15; //the width of the bullet
		this.h = 10; //the height of the bullet
		this.showB = true; //whether or not the bullet should be shown
	}
	show() {
		if (!this.showB) return;
		push();
		translate(translateX + this.x, translateY + this.y);
		// translate(10, 0);
		// translate(0, -7);
		rotate(this.dir);
		fill(75);
		beginShape();
		vertex(0, this.h / 4);
		vertex(this.w / 2, this.h / 4);
		vertex(this.w, 0);
		vertex(this.w / 2, -this.h / 4);
		vertex(0, -this.h / 4);
		vertex(this.w / 6, 0);
		endShape(CLOSE);
		this.x += this.direction.x;
		this.y += this.direction.y;
		pop();
		for (let i = 0; i < rocks.length; i++) {
			//check if the bullet is colliding with a rock
			if (rectIntersect(this, rocks[i])) {
				//if it is, remove the bullet and the rock
				rocks.splice(i, 1);
				ex = new explosionStates(this.x, this.y, this.dir);
				this.showB = false;
				return;
			}
		}
		for (let i = 0; i < enemies.length; i++) {
			if (rectIntersect(this, enemies[i])) {
				//if the bullet hits an enemy
				enemies.splice(i, 1); //remove the enemy
				ex = new explosionStates(this.x, this.y, this.dir); //create an explosion
				rocks.push(new Tile(this.x, this.y, 20, 20, "r")); //create a rock where the enemy was killed
				this.showB = false; //remove the bullet
				return;
			}
		}
	}
}

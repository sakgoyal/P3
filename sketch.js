p5.disableFriendlyErrors = true; // disables FES to increase performance
function keyPressed() {
	keyArray[keyCode] = 1;
	if (key === " " && numBullets > 0 && !title && !gameOver && !gameWin) {
		bul = new bulletStates(player.x + 10, player.y + 10, radians(playerAngle));
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
	rocks = [];
	prizes = [];
	enemies = [];
	ammoBox = [];
	translateX = 0;
	translateY = 0;
	killCount = 0;
	playerAngle = 0;
	numBullets = 6;
	for (let i = 0; i < 42; i++) {
		for (let j = 0; j < 42; j++) { 
			if (map2[j][i] === " ") continue; //if the tile is empty, skip it
			else if (map2[j][i] === "c") player = new    cclass(i * 20, j * 20); //player
			else if (map2[j][i] === "r") rocks.push(new   rclass(i * 20, j * 20)); //rock
			else if (map2[j][i] === "p") prizes.push(new  Tile(i * 20, j * 20, "p")); //prize
			else if (map2[j][i] === "e") enemies.push(new eclass(i * 20, j * 20)); //enemy
			else if (map2[j][i] === "a") ammoBox.push(new Tile(i * 20, j * 20, "a")); //ammo box
		}
	}
	initPlayer(); //initialize the player texture
	translate(3, 25);
	initRock(); //initialize the rock texture
}
function initPlayer() {
	push();
	background(100, 140, 0); //draw background color (green)
	fill(103, 140, 199);
	rect(0, 0, 20, 20); // main hull
	noStroke();
	for (let i = 0; i < 7; i++) {
		i % 2 == 0 ? fill(0) : fill(81, 81, 81);
		rect(0, i * 3, 4, 4); // left and right side of wheels
		rect(20 - 4, i * 3, 4, 4);
	}
	stroke(0);
	fill(50, 100, 200);
	rect(20 * 0.45, -20 / 2, 20 / 10, 15, 3); // gun
	rect(20 / 3, 5, 20 / 3, 10, 2); // top hull
	pop();
	playertex = get(0, 0, 20, 20);
}
function initRock() {
	push();
	stroke(0);
	fill(80);
	strokeWeight(2);
	let w = 16;
	arc(w / 2, 7, w, 20 / 1.5, PI, 0);
	line(0, 7, 0, 20);
	line(w, 7, w, 20);
	line(0, 20, w, 20);
	noStroke();
	rect(1, 6, w - 2, 14);
	fill(60);
	rect(2, 12, w - 4, 2);
	rect(2, 16, w - 4, 2);
	rocktex = get(2, 23, 20, 25);
	pop();
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
	if (gameOver) return gameOverScreen(); //if the game is over, show the game over screen
	if (gameWin) return gameWinScreen(); //if the game is won, show the game win screen
	noFill();
	moveEnemies(); //move the enemies in the wander state or the chase state depending on the distance to the player
	for (let i = 0; i < enemies.length; i++) {
		if (rectIntersect(player, enemies[i])) gameOver = true; //if the player collides with an enemy, the game is over
	}
	playermove();
	image(walltexture, translateX, translateY, 800, 840);

	for (var pri of prizes) pri.show();
	for (var ene of enemies) ene.show();
	for (var roc of rocks) roc.show();
	for (var box in ammoBox) ammoBox[box].show();
	player.show();

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
var rocks = [];
var prizes = [];
var ammoBox = [];
var player;
var playertex;
var walltexture;
var rocktex;
var gameOver = false;
var gameWin = false;
var explosion;
var ex;
var bul;
var numBullets = 6;
const enemyspeed = 1.6;
const playerspeed = 2;
const map2 = [
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
	"wp           r     r                   w",
	"w                            r         w",
	"w   r     r        e              p    w",
	"w                  r             r     w",
	"w         a                            w",
	"w     r   p               r            w",
	"w                   r                  w",
	"w                               p      w",
	"w        r        r                    w",
	"w         c               r      r     w",
	"w    r                                 w",
	"w                 r     p           r  w",
	"w          r             r             w",
	"w                    a            e    w",
	"w       p                      r   p   w",
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
	"w     r p                              w",
	"w                r                     w",
	"w                       r        r     w",
	"w           r           p              w",
	"w     p                           r    w",
	"w               a     r                w",
	"w       r                    r         w",
	"w                                      w",
	"w      r    p    r                     w",
	"w                             p        w",
	"w                    r              r  w",
	"w       r       r    p                 w",
	"w   e   p                   e          w",
	"w            r         r      p     r  w",
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
	keyArray[65] === 1 || keyArray[LEFT_ARROW] ? (playerAngle -= 3) : playerAngle;
	keyArray[68] === 1 || keyArray[RIGHT_ARROW] ? (playerAngle += 3) : playerAngle;
	if (forward) {
		movePlayer(cos(radians(playerAngle)) * playerspeed * forward, 0); //move the player horizontally
		movePlayer(0, sin(radians(playerAngle)) * playerspeed * forward); //move the player vertically
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
			player.x -= 2 * x;
			player.y -= 2 * y;
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
	player.x = constrain(newPos.x, 20, 760); //constrain the player's position to the map
	player.y = constrain(newPos.y, 20, 800);

	const cameraMargin = 150;
	if (player.x + translateX < cameraMargin) translateX++;
	else if (player.x + translateX > width - cameraMargin) translateX--;
	if (player.y + translateY < cameraMargin) translateY++;
	else if (player.y + translateY > height - cameraMargin) translateY--;
}
function moveEnemies() {
	for (let enemy of enemies) {
		if (distSquared(enemy.x, enemy.y, player.x, player.y) > enemy.range ** 2) {
			enemy.wander();
			continue;
		}
		let xdist = Math.abs(enemy.x - player.x);
		let ydist = Math.abs(enemy.y - player.y);
		enemy.direction = p5.Vector.fromAngle(atan2(player.y - enemy.y, player.x - enemy.x)).mult(enemyspeed);
		if (xdist > ydist) enemy.x += enemy.direction.x;
		else enemy.y += enemy.direction.y;

		for (let i = 0; i < rocks.length; i++) {
			if (rectIntersect(enemy, rocks[i])) {
				enemy.x -= 4 * enemy.direction.x;
				enemy.y -= 4 * enemy.direction.y;
				return;
			}
		}
	}
}
class Tile {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.type = type; // the type of tile this is (see above)
		this.pindex = [int(random(3, 5)), int(random(2))]; //random index for the prize image
		this.direction = p5.Vector.random2D().mult(0.2 * enemyspeed); //the direction the enemy should wander in
	}
	show() {
		push();
		translate(translateX, translateY); //move the camera
		if (this.type == "p") {
			//if the tile is a prize
			image(getSprite(this.pindex[0], this.pindex[1]), this.x, this.y, 20, 20); //prize
		} else if (this.type == "a") {
			//if the tile is an ammo crate
			image(getSprite(4, 2), this.x, this.y, 20, 20); // ammo  crate
		}
		pop();
	}
}
class pclass {}
class cclass {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
	}
	show() {
		push();
		translate(translateX + this.x + this.w / 2, translateY + this.y + this.h / 2); //move the camera
		rotate(radians(playerAngle + 90));
		image(playertex, -this.w / 2, -this.h / 2);
		pop();
	}
}
class eclass {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.wanderFrames = 3 * frameRate; //how many frames the enemy should wander for in seconds
		this.direction = p5.Vector.fromAngle(0); //the direction the enemy should wander in
		this.range = 100;
	}
	show() {
		push();
		translate(translateX + this.x + this.w / 2, translateY + this.y + this.h / 2); //move the camera
		rotate(this.direction);
		image(getSprite(1, 0), -this.w / 2, -this.h / 2);
		stroke(0, 50);
		circle(0, 0, 2 * this.range);
		pop();
	}
	wander() {
		if (this.wanderFrames > 0) {
			this.wanderFrames--;
			for (let i = 0; i < rocks.length; i++) {
				if (rectIntersect(this, rocks[i])) {
					this.x -= 4 * this.direction.x;
					this.y -= 4 * this.direction.y;
					return;
				}
			}
			this.x = constrain(this.x + this.direction.x, 20, 760);
			this.y = constrain(this.y + this.direction.y, 20, 800);
		} else {
			this.wanderFrames = random(60, 120);
			this.direction = p5.Vector.random2D().mult(0.2 * enemyspeed);
		}
	}
}
class rclass {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
	}
	show() {
		push();
		translate(translateX, translateY);
		image(rocktex, this.x, this.y, 20, 20);
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
				rocks.push(new rclass(this.x - 10, this.y - 10)); //create a rock where the enemy was killed
				this.showB = false; //remove the bullet
				return;
			}
		}
	}
}

p5.disableFriendlyErrors = true; // disables FES to increase performance
function keyPressed() {
	keyArray[keyCode] = 1;
	if (key === " " && !title && !gameOver && !gameWin) {
		bul = new bulletclass(player.x + 10, player.y + 10, radians(playerAngle));
	}
} 
function keyReleased() {
	keyArray[keyCode] = 0;
}
function setup() {
	createCanvas(400, 400);
	stroke(0);
	strokeWeight(1);
	background(0, 0, 0, 0);
	rocks = [];
	prizes = [];
	enemies = [];
	trail = [];
	translateX = 0;
	translateY = 0;
	killCount = 0;
	playerAngle = 0;
	for (let i = 0; i < 42; i++) {
		for (let j = 0; j < 42; j++) {
			if (map2[j][i] === " ") grass.push(new gclass(i * 20, j * 20)); //if the tile is empty, add a grass tile
			else if (map2[j][i] === "c") player = new cclass(i * 20, j * 20); //player
			else if (map2[j][i] === "r") rocks.push(new rclass(i * 20, j * 20)); //rock
			else if (map2[j][i] === "p") prizes.push(new pclass(i * 20, j * 20)); //prize
			else if (map2[j][i] === "e") enemies.push(new eclass(i * 20, j * 20)); //enemy
		}
	}
	initPlayer(); //initialize the player texture
	translate(3, 25);
	initRock(); //initialize the rock texture
	initBullet(); //initialize the bullet texture
	translate(0, 25);
	initEnemy(); //initialize the enemy texture
}
function initPlayer() {
	push();
	background(100, 140, 0, 0); //draw background color (green)
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
function initBullet() {
	push();
	let w = 15; //the width of the bullet
	let h = 10; //the height of the bullet
	translate(10, 80);
	rotate(this.dir);
	fill(75);
	beginShape();
	vertex(0, h / 4);
	vertex(w / 2, h / 4);
	vertex(w, 0);
	vertex(w / 2, -h / 4);
	vertex(0, -h / 4);
	vertex(w / 6, 0);
	endShape(CLOSE);
	bullettex = get(11, 101, 18, 8);
	pop();
}
function initEnemy() {
	push();
	stroke(0);
	fill(200, 40, 40);
	circle(10, 10, 20);
	fill(200, 200, 200);
	noStroke();
	let eyex = 14;
	ellipse(eyex, 6, 5, 6);
	ellipse(eyex, 14, 5, 6);
	fill(0);
	ellipse(eyex, 6, 4, 3);
	ellipse(eyex, 14, 4, 3);
	pop();
	enemytex = get(2, 49, 22, 22);
	push();
	translate(20, 20);
	stroke(0);
	fill(150, 40, 40);
	circle(10, 10, 12);
	fill(200, 200, 200);
	noStroke();
	ellipse(eyex, 6, 5, 6);
	ellipse(eyex, 14, 5, 6);
	fill(0);
	ellipse(eyex, 6, 4, 3);
	ellipse(eyex, 14, 4, 3);
	pop();
	enemytex2 = get(20, 70, 20, 20);
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
	text("Shooty Shooty", width / 2, height / 2 - 80);
	text("Bang Bang", width / 2, height / 2 - 40);
	textSize(16);
	text("Press Space to Start", width / 2, height / 2);
	// show the controls
	textSize(12);
	text("Controls:", width / 2, height / 2 + 50);
	text("WASD or Arrow Keys to move", width / 2, height / 2 + 70);
	text("Space to shoot", width / 2, height / 2 + 90);
	// image(getSprite(3, 3), width / 2 - 32, height / 2 + 100, 64, 64);
	if (keyArray[32] === 1) title = false;
	pop();
}
function handletrails() {
	// create a trail of lines behind the player that fades out over time
	for (let i = 0; i < trail.length; i++) {
		push();
		translate(translateX + trail[i].x, translateY + trail[i].y);
		rotate(radians(trail[i].angle));
		stroke(0, 0, 0, i * 5);
		line(0, 0, trail[i].x - trail[i].x2, trail[i].y - trail[i].y2);
		pop();
	}
	// add the current position of the player to the trail
	trail.push({
		x: player.x + player.w / 2,
		y: player.y + player.h / 2,
		x2: player.x,
		y2: player.y + player.h / 2,
		angle: playerAngle,
	});
	if (trail.length > 30) trail.shift(); // remove the oldest line in the trail if there are more than 50 lines
}
function draw() {
	background(100, 140, 0);
	if (title) return showTitle();
	if (gameOver) return gameOverScreen();
	if (gameWin) return gameWinScreen();

	for (let i = 0; i < grass.length; i++) grass[i].show(); // draw all the grass tiles (ONLY ENABLE THIS IF YOUR COMPUTER IS FAST ENOUGH, OTHERWISE IT WILL BE SLOW)
	playermove();
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].move();
		enemies[i].show();
		if (rectIntersect(player, enemies[i])) gameOver = true;
	}

	stroke(0);
	line(translateX + 20, translateY + 20, translateX + 780, translateY + 20); //top wall
	line(translateX + 20, translateY + 20, translateX + 20, translateY + 820); //left wall
	line(translateX + 780, translateY + 20, translateX + 780, translateY + 820); //right wall
	line(translateX + 20, translateY + 820, translateX + 780, translateY + 820); //bottom wall

	for (var pri of prizes) pri.show();
	for (var roc of rocks) roc.show();

	player.show();
	noStroke();
	textSize(20);
	fill(0);
	text("Prizes Left: " + prizes.length, 10, 20);
	if (ex) ex.show();
	if (bul) bul.show();
}
var title = true;
var winRotate = 0;
var playerAngle = 0;
var keyArray = [];
var translateX = 0;
var translateY = 0;
var enemies = [];
var rocks = [];
var prizes = [];
var grass = [];
var trail = [];
var player;
var playertex;
var enemytex;
var enemytex2;
var bullettex;
var rocktex;
var gameOver = false;
var gameWin = false;
var ex;
var bul;
const enemyspeed = 1.6;
const playerspeed = 2;
const map2 = [
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
	"wp           r     r                   w",
	"w                            r         w",
	"w   r     r        e              p    w",
	"w                  rr            r     w",
	"w         a                            w",
	"w     r   p                            w",
	"w                                      w",
	"w                               p      w",
	"w        r        r                    w",
	"w         c       r       r      r     w",
	"w    r            r                    w",
	"w                       p           r  w",
	"w          r             r             w",
	"w                    a            e    w",
	"w       p                      r   p   w",
	"w   e                                  w",
	"w            r    r       p            w",
	"w                                 r    w",
	"w        p                             w",
	"w                r                     w",
	"w                        r     p       w",
	"w  p              r r                  w",
	"w          r      r p e                w",
	"w                                  r   w",
	"w             r             r          w",
	"w     r p                              w",
	"w                r                     w",
	"w                       r              w",
	"w           r           p         r    w",
	"w     p                           r    w",
	"w               a     r                w",
	"w                                      w",
	"w                                      w",
	"w      rr   p    r          r          w",
	"w                             p        w",
	"w                                   r  w",
	"w       r       r r  p                 w",
	"w   e   p                   e          w",
	"w            r         r      p     r  w",
	"w                                      w",
	"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
];
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
	handletrails();
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
		if (rectIntersect(newPos, rocks[i])) {
			player.x -= 2 * x; // make the player bounce back if they hit a rock
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
	player.x = constrain(newPos.x, 20, 760); //constrain the player's position to the map
	player.y = constrain(newPos.y, 20, 800);

	const cameraMargin = 150;
	if (player.x + translateX < cameraMargin) translateX++;
	else if (player.x + translateX > width - cameraMargin) translateX--;
	if (player.y + translateY < cameraMargin) translateY++;
	else if (player.y + translateY > height - cameraMargin) translateY--;
}
function orthogonalProjection(a, b, p) {
	// find nearest point along a LINE
	d1 = p5.Vector.sub(b, a).normalize();
	d2 = p5.Vector.sub(p, a);
	d1.mult(d2.dot(d1));
	return p5.Vector.add(a, d1);
}
class pclass {
	// prize class
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.color = [random(30, 110), random(60, 190), random(80, 255)];
		this.img;
	}
	show() {
		push();
		fill(this.color);
		stroke(0);
		strokeWeight(1);
		translate(translateX + this.x + 10, translateY + this.y + 10);
		circle(0, 0, 10);
		pop();
	}
}
class cclass {
	// character class
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
	// enemy class
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.wanderFrames = 3 * frameRate; //how many frames the enemy should wander for in seconds
		this.direction = p5.Vector.fromAngle(0); //the direction the enemy should wander in or chase the player in
		this.range = 100;
		this.health = 2;
		this.avoid = false; //whether the enemy should avoid the bullet
	}
	show() {
		push();
		translate(translateX + this.x + this.w / 2, translateY + this.y + this.h / 2); //move the camera
		rotate(this.direction.heading());
		translate(-this.w / 2, -this.h / 2);
		if (this.health === 2) image(enemytex, 0, 0);
		else image(enemytex2, 0, 0);
		pop();
	}
	move() {
		if (bul && bul.showB) {
			let a = bul.start;
			let b = bul.end;
			let p = createVector(this.x, this.y);
			let op = orthogonalProjection(a, b, p);
			let d = p5.Vector.dist(p, op);
			let avoiddir = createVector(this.x - op.x, this.y - op.y)
				.normalize()
				.mult(enemyspeed);
			if (d < 100 && dist(bul.x, bul.y, this.x, this.y) < 100) {
				this.avoid = true;
				this.x = constrain(this.x + avoiddir.x, 20, 760);
				this.y = constrain(this.y + avoiddir.y, 20, 800);
				this.direction = avoiddir;
			} else this.avoid = false;
		} else this.avoid = false;
		if (!this.avoid && distSquared(this.x, this.y, player.x, player.y) > this.range ** 2) {
			this.wander();
			return;
		}
		let xdist = Math.abs(this.x - player.x);
		let ydist = Math.abs(this.y - player.y);
		if (!this.avoid) this.direction = p5.Vector.fromAngle(atan2(player.y - this.y, player.x - this.x)).mult(enemyspeed);
		if (xdist > ydist) this.x += this.direction.x;
		else this.y += this.direction.y;

		for (let i = 0; i < rocks.length; i++) {
			if (rectIntersect(this, rocks[i])) {
				this.x -= 4 * this.direction.x;
				this.y -= 4 * this.direction.y;
				return;
			}
		}
		this.x = constrain(this.x, 20, 760);
		this.y = constrain(this.y, 20, 800);
	}
	wander() {
		if (this.wanderFrames > 0) {
			this.wanderFrames--;
			for (let i = 0; i < rocks.length; i++) {
				if (rectIntersect(this, rocks[i])) {
					this.x -= 4 * this.direction.x;
					this.y -= 4 * this.direction.y;
					this.wanderFrames = random(60, 120);
					this.direction = p5.Vector.random2D().mult(0.2 * enemyspeed);
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
	// rock class
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
class explosionclass {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.colorS = [255, 30, 30, 255];
		this.colorF = [255, 255, 0, 255];
	}
	show() {
		if (this.colorS[3] < 1) return;
		push();
		stroke(this.colorS);
		fill(this.colorF);
		translate(translateX + this.x, translateY + this.y);
		beginShape();
		for (let i = 0; i < 50; i++) {
			let v;
			if (i % 2 == 0) v = createVector(random(-10, 10), random(-10, 10));
			else v = createVector(random(-15, 15), random(-15, 15));
			vertex(v.x, v.y);
		}
		endShape(CLOSE);
		pop();
		this.colorS[3] -= 10;
		this.colorS[0] -= 1;
		this.colorF[0] -= 10;
		this.colorF[1] -= 10;
		this.colorF[3] -= 10;
	}
}
class bulletclass {
	constructor(x, y, dir) {
		this.dir = dir;
		this.x = x;
		this.y = y;
		this.direction = p5.Vector.fromAngle(this.dir).mult(5); //the direction the bullet should move in
		this.start = createVector(this.x, this.y);
		this.end = createVector(this.x + 260 * this.direction.x, this.y + 260 * this.direction.y);
		this.w = 15; //the width of the bullet
		this.h = 10; //the height of the bullet
		this.showB = true; //whether or not the bullet should be shown
	}
	show() {
		if (!this.showB) return;
		push();
		translate(translateX + this.x, translateY + this.y);
		rotate(this.dir);
		image(bullettex, 0, 0, 18, 9);
		this.x += this.direction.x;
		this.y += this.direction.y;
		pop();
		for (let i = 0; i < rocks.length; i++) {
			if (rectIntersect(this, rocks[i])) {
				rocks.splice(i, 1);
				// ex = new explosionStates(this.x, this.y, this.dir);
				ex = new explosionclass(this.x, this.y);
				this.showB = false;
				return;
			}
		}
		for (let i = 0; i < enemies.length; i++) {
			if (rectIntersect(this, enemies[i])) {
				// enemies.splice(i, 1);
				enemies[i].health--;
				if (enemies[i].health <= 0) {
					enemies.splice(i, 1);
				}
				// ex = new explosionStates(this.x, this.y, this.dir);
				ex = new explosionclass(this.x, this.y);
				this.showB = false;
				return;
			}
		}
	}
}
class gclass {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.color = [random(80, 120), random(120, 160), random(0), random(0, 80)];
	}
	show() {
		push();
		translate(translateX, translateY);
		fill(this.color);
		rect(this.x, this.y, 20, 20);
		pop();
	}
}
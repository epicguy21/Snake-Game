var canvas = document.getElementById('game');
var score = document.getElementById('score');
var ctx = canvas.getContext('2d');

var moveKeys = ['w', 'a', 's', 'd'];
var currentKey = '';

class position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class apple {
    constructor() {
        this.position = this.getRandomPosition();
        console.log(this.position);
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 32, 32)
        console.log('draw apple');
    }

    changePositions() {
        this.position = this.getRandomPosition();
    }

    getRandomInt() {
        return Math.floor(Math.random() * 32) * 32;
    }

    getRandomPosition() {
        return new position(this.getRandomInt(), this.getRandomInt());
    }
}

class snake {
    constructor() {
        this.body = [new position(512, 512)];
        this.velocity = new position(0, 0);
    }

    draw() {
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.body[i].x, this.body[i].y, 32, 32);

            console.log('draw');
        }
    }

    update() {
        //Move snake in direction based on keypress
        switch (currentKey) {
            case 'w':
                if (this.velocity.y != 1) {
                    this.velocity.x = 0;
                    this.velocity.y = -1;
                }
                break;
            case 'a':
                if (this.velocity.x != 1) {
                    this.velocity.x = -1;
                    this.velocity.y = 0;
                }
                break;
            case 's':
                if (this.velocity.y != -1) {
                    this.velocity.x = 0;
                    this.velocity.y = 1;
                }
                break;
            case 'd':
                if (this.velocity.x != -1) {
                    this.velocity.x = 1;
                    this.velocity.y = 0;
                }
            default:
                break;
        }

        //Snake body up
        for (let i = this.body.length - 1; i >= 1; i--) {
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }

        //Move head
        this.body[0].x += this.velocity.x * 32;
        this.body[0].y += this.velocity.y * 32;

        if (this.collideWall()) {
            console.log('hit wall, resetting snake');
            this.reset();
        }
    }

    collides(object) {
        if (this.body[0].x == object.position.x && this.body[0].y == object.position.y) {
            return true;
        }
    }

    collideWall() {
        //Check collision with wall
        if (this.body[0].x >= 1024 || this.body[0].x < 0 || this.body[0].y >= 1024 || this.body[0].y < 0) {
            return true;
        }
        //Check collision with self
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                return true;
            }
        }

        return false;
    }

    grow() {
        this.body.push(new position(this.body[0].x, this.body[0].y));
        console.log(this.body);
    }

    reset() {
        this.body = [new position(512, 512)];
        this.velocity = new position(0, 0);
    }
}

function clear() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1024, 1024);
}

function grid() {
    for (let x = 0; x < 1024; x += 32) {
        for (let y = 0; y < 1024; y += 32) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, 32, 32);
        }
    }
}

var Snake = new snake(new position(512, 512));
var Apple = new apple();

function game_loop() {
    //Clear screen and draw grid
    clear();
    grid();
    //Draw snake and update
    Snake.draw();
    Snake.update();
    //Draw apple
    Apple.draw();

    //Check collision with apple
    if (Snake.collides(Apple)) {
        Snake.grow();
        Apple.changePositions();
    }

    //Update score
    score.innerHTML = "Score: " + (Snake.body.length - 1);
}

function key_handler(key, type) {
    for (let i = 0; i < moveKeys.length; i++) {
        if (moveKeys[i] == key) {
            if (type == 'down') {
                currentKey = key;
            } else {
                if (currentKey == key) {
                    currentKey = '';
                }
            }
        }
    }
}

addEventListener('keydown', (e) => {
    let key = e.key.toLowerCase();
    key_handler(key, 'down')
});

addEventListener('keyup', (e) => {
    let key = e.key.toLowerCase();
    key_handler(key, 'up');
});

setInterval(game_loop, 1000/15);
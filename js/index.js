// -------------------- Game Constants & Variables --------------------
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let speed = 19;
let score = 0;
let lastPaintTime = 0;

let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

musicSound.volume = 0.4;
foodSound.volume = 1.0;
moveSound.volume = 0.9;
gameOverSound.volume = 1.0;

// -------------------- Game Functions --------------------
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // Wall collision
    return snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0;
}

function gameEngine() {
    // Collision check
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Tap or press a key to play again.");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        musicSound.play();
    }

    // Eat food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }

        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// -------------------- Main Logic --------------------
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

window.requestAnimationFrame(main);

// -------------------- Controls (Keyboard + Touch) --------------------
window.addEventListener('keydown', e => {
    if (musicSound.paused) {
        musicSound.play().catch(err => console.log("Audio play blocked:", err));
    }

    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});

// ----------- Touch Controls for Mobile (Swipe Detection) ------------
let startX, startY;

window.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

window.addEventListener("touchend", e => {
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    if (musicSound.paused) {
        musicSound.play().catch(err => console.log("Audio play blocked:", err));
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && inputDir.x !== -1) inputDir = { x: 1, y: 0 };
        else if (diffX < 0 && inputDir.x !== 1) inputDir = { x: -1, y: 0 };
    } else {
        // Vertical swipe
        if (diffY > 0 && inputDir.y !== -1) inputDir = { x: 0, y: 1 };
        else if (diffY < 0 && inputDir.y !== 1) inputDir = { x: 0, y: -1 };
    }

    moveSound.play();
});

});




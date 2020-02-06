console.log("hooked up");

const showBtn = document.getElementById("rules-btn");
const rules = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");
const body = document.querySelector(".body");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let colorsArray = [
  "#0095dd",
  "#959f87",
  "#6f9940",
  "#763568",
  "#b86d29",
  "#e623ac",
  "#3c092d",
  "#ad0035"
];

let mainTheme = colorsArray[0];

body.style.backgroundColor = mainTheme;

let level = 1;
let score = 0;
let highestScore = 0;
let scoreLevelBreakPoint = 45;

const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
};

// Create Paddle Props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 120,
  h: 10,
  speed: 8,
  dx: 0
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// Create bricks
const bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
  ctx.fillStyle = mainTheme;
  ctx.fill();
  ctx.closePath();
};

// Draw paddle on canvas
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = mainTheme;
  ctx.fill();
  ctx.closePath();
};

// Draw score and level on canvas
const drawScore = () => {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 150, 30);
  ctx.fillText(`Level: ${level}`, canvas.width - 235, 30);
  if (highestScore > 0) {
    ctx.fillText(`High Score: ${highestScore}`, 45, 30);
  }
};

// Draw bricks to canvas
const drawBricks = () => {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? mainTheme : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

// Move ball on canvas
const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;
  console.log(ball.x, ball.y, ball.dx, ball.dy);

  // Wall collision
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  } else if (ball.y + ball.size > canvas.height || ball.y - ball.size <= 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  // Hit bottom call lose/reset
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    if (score > highestScore) {
      highestScore = score;
    }
    score = 0;
    level = 1;
    mainTheme = colorsArray[0];
    body.style.backgroundColor = mainTheme;
    changeDifficulty();
  }
};

// Change Difficulty
const changeDifficulty = () => {
  if (level === 1) {
    paddle.w = 120;
    if (ball.dx > 0) {
      ball.dx = 4;
    } else {
      ball.dx = -4;
    }

    ball.dy = -4;
    ball.speed = 4;
    scoreLevelBreakPoint = 45;
  } else {
    paddle.w -= 5;
    scoreLevelBreakPoint = scoreLevelBreakPoint + 45 * level;
    if (level % 2 === 0) {
      if (ball.dx > 0) {
        ball.dx++;
      } else {
        ball.dx--;
      }

      if (ball.dy > 0) {
        ball.dy++;
      } else {
        ball.dy--;
      }

      ball.speed++;
    }

    body.style.backgroundColor = mainTheme;
  }
};

// Increase Score
const increaseScore = () => {
  score += level;

  if (score === scoreLevelBreakPoint) {
    showAllBricks();
    mainTheme = colorsArray[level];
    level++;
    changeDifficulty();
  }
};

// Show all bricks
const showAllBricks = () => {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
};

// Move paddle on canvas
const movePaddle = () => {
  paddle.x += paddle.dx;

  // wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
};

// Draw everything
const draw = () => {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

// Update canvas drawing and animation
const update = () => {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
};

update();

// Keydown event

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

showBtn.addEventListener("click", () => rules.classList.add("show"));

closeBtn.addEventListener("click", () => rules.classList.remove("show"));

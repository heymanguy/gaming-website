class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.gridSize = 20;
        this.tileCount = Math.floor(canvas.width / this.gridSize);
        this.reset();
        this.setupControls();
        this.gameLoop();
    }

    reset() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
    }

    setupControls() {
        document.addEventListener("keydown", (e) => {
            switch (e.key.toLowerCase()) {
                case "arrowup":
                    if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                    break;
                case "arrowdown":
                    if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                    break;
                case "arrowleft":
                    if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                    break;
                case "arrowright":
                    if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                    break;
            }
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => this.gameLoop(), 100);
    }

    update() {
        this.direction = this.nextDirection;
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        if (
            head.x < 0 ||
            head.x >= this.tileCount ||
            head.y < 0 ||
            head.y >= this.tileCount
        ) {
            this.reset();
            return;
        }

        if (this.snake.some((s) => s.x === head.x && s.y === head.y)) {
            this.reset();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = "#f5f5f5";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#667eea";
        this.snake.forEach((segment) => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        this.ctx.fillStyle = "#f5576c";
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        this.ctx.fillStyle = "#333";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
    }
}

class FlappyBirdGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.bird = {
            x: 50,
            y: canvas.height / 2,
            width: 30,
            height: 30,
            velocity: 0
        };
        this.gravity = 0.5;
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;
        this.pipeGap = 120;
        this.pipeWidth = 60;
        this.setupControls();
        this.gameLoop();
    }

    setupControls() {
        document.addEventListener("keydown", () => {
            this.bird.velocity = -10;
        });

        this.canvas.addEventListener("click", () => {
            this.bird.velocity = -10;
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.gameOver) return;

        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
            this.gameOver = true;
        }

        if (
            this.pipes.length === 0 ||
            this.pipes[this.pipes.length - 1].x < this.canvas.width - 150
        ) {
            const topHeight =
                Math.random() * (this.canvas.height - this.pipeGap - 40) + 20;
            this.pipes.push({ x: this.canvas.width, topHeight: topHeight, scored: false });
        }

        this.pipes = this.pipes.filter((p) => p.x + this.pipeWidth > 0);

        this.pipes.forEach((pipe) => {
            pipe.x -= 4;

            if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                this.score += 10;
                pipe.scored = true;
            }

            if (
                this.bird.x + this.bird.width > pipe.x &&
                this.bird.x < pipe.x + this.pipeWidth
            ) {
                if (
                    this.bird.y < pipe.topHeight ||
                    this.bird.y + this.bird.height > pipe.topHeight + this.pipeGap
                ) {
                    this.gameOver = true;
                }
            }
        });
    }

    draw() {
        this.ctx.fillStyle = "#87CEEB";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#FFD700";
        this.ctx.fillRect(
            this.bird.x,
            this.bird.y,
            this.bird.width,
            this.bird.height
        );

        this.ctx.fillStyle = "#228B22";
        this.pipes.forEach((pipe) => {
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            this.ctx.fillRect(
                pipe.x,
                pipe.topHeight + this.pipeGap,
                this.pipeWidth,
                this.canvas.height - pipe.topHeight - this.pipeGap
            );
        });

        this.ctx.fillStyle = "#000";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        if (this.gameOver) {
            this.ctx.fillText(
                "GAME OVER - Refresh to Play Again",
                this.canvas.width / 2 - 150,
                this.canvas.height / 2
            );
        }
    }
}

class TetrisGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.blockSize = 30;
        this.cols = Math.floor(canvas.width / this.blockSize);
        this.rows = Math.floor(canvas.height / this.blockSize);
        this.board = Array(this.rows)
            .fill()
            .map(() => Array(this.cols).fill(0));
        this.currentPiece = this.getNewPiece();
        this.score = 0;
        this.setupControls();
        this.gameLoop();
    }

    getNewPiece() {
        const pieces = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]],
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1, 1], [1, 1, 0]]
        ];

        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        return {
            shape: piece,
            x: Math.floor(this.cols / 2) - Math.floor(piece[0].length / 2),
            y: 0,
            color: [
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#FFA07A",
                "#98D8C8",
                "#F7DC6F",
                "#BB8FCE"
            ][Math.floor(Math.random() * 7)]
        };
    }

    setupControls() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                this.currentPiece.x = Math.max(0, this.currentPiece.x - 1);
            }
            if (e.key === "ArrowRight") {
                this.currentPiece.x = Math.min(
                    this.cols - this.currentPiece.shape[0].length,
                    this.currentPiece.x + 1
                );
            }
            if (e.key === "ArrowDown") {
                this.dropPiece();
            }
        });
    }

    dropPiece() {
        this.currentPiece.y++;
        if (this.collides()) {
            this.currentPiece.y--;
            this.lockPiece();
            this.currentPiece = this.getNewPiece();
        }
    }

    collides() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    const y = this.currentPiece.y + r;
                    const x = this.currentPiece.x + c;

                    if (
                        y >= this.rows ||
                        x < 0 ||
                        x >= this.cols ||
                        (y >= 0 && this.board[y][x])
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lockPiece() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    const y = this.currentPiece.y + r;
                    const x = this.currentPiece.x + c;

                    if (y >= 0) this.board[y][x] = this.currentPiece.color;
                }
            }
        }
        this.clearLines();
    }

    clearLines() {
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r].every((cell) => cell !== 0)) {
                this.board.splice(r, 1);
                this.board.unshift(Array(this.cols).fill(0));
                this.score += 100;
            }
        }
    }

    gameLoop() {
        this.dropPiece();
        this.draw();
        setTimeout(() => this.gameLoop(), 500);
    }

    draw() {
        this.ctx.fillStyle = "#f5f5f5";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c]) {
                    this.ctx.fillStyle = this.board[r][c];
                    this.ctx.fillRect(
                        c * this.blockSize,
                        r * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            }
        }

        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    this.ctx.fillStyle = this.currentPiece.color;
                    this.ctx.fillRect(
                        (this.currentPiece.x + c) * this.blockSize,
                        (this.currentPiece.y + r) * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            }
        }

        this.ctx.fillStyle = "#000";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    }
}
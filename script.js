// CHOOSE YOUR GAMES HERE - Add or remove games from this list
const games = [
    {
        id: 1,
        name: "Snake",
        description: "Classic snake game - eat food, avoid walls!",
        icon: "🐍",
        type: "builtin",
        game: "snake"
    },
    {
        id: 2,
        name: "Flappy Bird",
        description: "Navigate through pipes!",
        icon: "🐦",
        type: "builtin",
        game: "flappy"
    },
    {
        id: 3,
        name: "Tetris",
        description: "Classic block puzzle game",
        icon: "🧱",
        type: "builtin",
        game: "tetris"
    }
    // ADD MORE GAMES BELOW BY COPYING THIS FORMAT:
    // {
    //     id: 4,
    //     name: "Your Game Name",
    //     description: "Description here",
    //     icon: "🎮",
    //     type: "url",
    //     url: "https://example.com/game"
    // }
];

const gamesList = document.getElementById("gamesList");
const modal = document.getElementById("gameModal");
const gameContainer = document.getElementById("gameContainer");
const gameTitle = document.getElementById("gameTitle");
const closeBtn = document.querySelector(".close");
const backBtn = document.getElementById("backButton");

document.addEventListener("DOMContentLoaded", () => {
    renderGamesList();
    setupEventListeners();
});

function setupEventListeners() {
    closeBtn.onclick = closeModal;
    backBtn.onclick = closeModal;

    window.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
}

function renderGamesList() {
    gamesList.innerHTML = "";

    games.forEach((game) => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <div class="game-icon">${game.icon || "🎮"}</div>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
        `;

        card.addEventListener("click", () => playGame(game));
        gamesList.appendChild(card);
    });
}

function playGame(game) {
    gameTitle.textContent = game.name;
    gameContainer.innerHTML = "";
    modal.style.display = "block";

    if (game.type === "builtin") {
        playBuiltinGame(game.game);
    } else if (game.type === "url") {
        const iframe = document.createElement("iframe");
        iframe.src = game.url;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.borderRadius = "10px";
        gameContainer.appendChild(iframe);
    }
}

function playBuiltinGame(gameType) {
    const canvas = document.createElement("canvas");
    canvas.width = gameContainer.clientWidth;
    canvas.height = gameContainer.clientHeight;
    canvas.style.display = "block";
    gameContainer.appendChild(canvas);

    if (gameType === "snake") {
        new SnakeGame(canvas);
    } else if (gameType === "flappy") {
        new FlappyBirdGame(canvas);
    } else if (gameType === "tetris") {
        new TetrisGame(canvas);
    }
}

function closeModal() {
    modal.style.display = "none";
    gameContainer.innerHTML = "";
}
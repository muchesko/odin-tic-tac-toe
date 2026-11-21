const Gameboard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    function getBoard() {
        return board;
    }

    function placeMarker(marker, position) {
        if (board[position] === "" && position <= 8 && position >= 0) {
            board[position] = marker;
            return true;
        } else {
            return false;
        }
    }

    function checkWinner() {
        for (let i = 0; i < winningCombinations.length; i++) {
            const a = winningCombinations[i][0];
            const b = winningCombinations[i][1];
            const c = winningCombinations[i][2];

            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                return true;
            }
        }
        return false;
    }

    function checkTie() {
        if ((board.every(square => square !== "") && checkWinner() === false)) {
            return true;
        } else {
            return false;
        }
    };

    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, placeMarker, checkWinner, checkTie, resetBoard };
})();

const GameController = (function () {
    function createPlayer(name, marker) {
        return { name, marker };
    }

    const player1 = createPlayer("Matthew", "X");
    const player2 = createPlayer("Computer", "O");

    let activePlayer = player1;
    let gameOver = false;

    function switchPlayer() {
        if (activePlayer === player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
    }

    function getCurrentPlayer() {
        return activePlayer;
    }

    function isGameOver() {
        return gameOver;
    }

    function playRound(position) {
        if (gameOver) {
            return;
        }
        const moveSuccessful = Gameboard.placeMarker(activePlayer.marker, position);
        if (moveSuccessful) {
            const hasWinner = Gameboard.checkWinner();
            if (hasWinner) {
                gameOver = true;
            } else if (Gameboard.checkTie()) {
                gameOver = true;
            }
            else {
                switchPlayer();
            }
        }
    }

    function restart() {
        Gameboard.resetBoard();
        activePlayer = player1;
        gameOver = false;
    }

    function setPlayerNames(name1, name2) {
        player1.name = name1;
        player2.name = name2;
    }

    return { playRound, restart, getCurrentPlayer, isGameOver, setPlayerNames };
})();

const DisplayController = (function () {
    const boardContainer = document.querySelector("#gameboard");

    function renderBoard() {
        getCurrentTurn();
        boardContainer.textContent = "";
        const board = Gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
            const square = document.createElement("div");
            square.textContent = board[i];
            boardContainer.appendChild(square);
            square.classList.add("square");
            square.addEventListener("click", () => {
                GameController.playRound(i);
                renderBoard();
            });
        }
    }

    const restartGameButton = document.querySelector("#restart-button");
    restartGameButton.addEventListener("click", () => {
        GameController.restart();
        renderBoard();
    });

    const player1Input = document.querySelector("#player-1-input");
    const player2Input = document.querySelector("#player-2-input");
    const startButton = document.querySelector("#start-button");
    const turnDisplay = document.querySelector("#turn-display");

    startButton.addEventListener("click", () => {
        const player1Name = player1Input.value;
        const player2Name = player2Input.value;
        if (player1Name.trim() === "" || player2Name.trim() === "") {
            turnDisplay.textContent = "Invalid Player Name(s)";
            return;
        }
        GameController.setPlayerNames(player1Name, player2Name);
        GameController.restart();
        renderBoard();
    });

    function getCurrentTurn() {
        const currentTurn = GameController.getCurrentPlayer();
        if (GameController.isGameOver() && Gameboard.checkWinner()) {
            turnDisplay.textContent = `${GameController.getCurrentPlayer().name} Wins!`
        } else if (Gameboard.checkTie()) {
            turnDisplay.textContent = "It's A Tie!"
        } else {
            turnDisplay.textContent = `${currentTurn.name}'s Turn`;
        }
    }

    return { renderBoard };
})();
let cells = document.querySelectorAll(".cell");
let gameStatus = document.querySelector("#gameStatus");
let restartBtn = document.querySelector("#restartButton");

let winningCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let human = "X";
let ai = "O";
let currentPlayer;

let options = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let running = false;
let scores = {
    X: 10,
    O: -10,
    Draw: 0
};

initialise();

function initialise() {
    cells.forEach(cell => cell.addEventListener("click", cellClick));
    restartBtn.addEventListener("click", restartGame);
    currentPlayer = human;
    running = true;
}

function cellClick() {
    const cellIndex = this.getAttribute("cellIndex");
    if (options[cellIndex] != "" || running == false) {
        return;
    }

    updateCell(this, cellIndex);
    winnerCheck();
}

function updateCell(cell, cellindex) {
    options[cellindex] = currentPlayer;
    cell.textContent = currentPlayer;
}

function GameLogic() {
  for (let i = 0; i < winningCondition.length; i++) {
    const [a, b, c] = winningCondition[i];

    if (options[a] && options[a] === options[b] && options[a] === options[c]) {
      return options[a]; // Return the winner ("X" or "O")
    }
  }
  return options.includes("") ? null : "Draw"; // Return "Draw" if no empty cells and no winner
}

function winnerCheck() {
    const result = GameLogic();
    if (result) {
        if (result === "Draw") {
            gameStatus.innerHTML = "Draw!";
        } else{
            gameStatus.innerHTML = `${result} wins!`;
        }
        running = false;
    } else {
        NextTurn();
    }
}

function NextTurn() {
    currentPlayer = (currentPlayer == human) ? ai : human;
    if (currentPlayer === ai) {
        aiMove();
    }
}

function restartGame() {
    running = true;
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStatus.innerHTML = "";
    cells.forEach(cell => cell.textContent = "");
}

function aiMove() {
    let move;
    let bestscore = Infinity;
    for (let i = 0; i < options.length; i++){
        if (options[i] == "") {
            options[i] = ai;
            let score = miniMax(options, true);
            options[i] = "";
            if (score < bestscore) {
                bestscore = score;
                move = i;
            }
        }
    }
    updateCell(cells[move], move);
    winnerCheck();
}

function miniMax(newOptions, maximizing) {
    let result = GameLogic();
    if (result !== null) {
        return scores[result];
    }

    if (maximizing) {
        let bestscore = -Infinity;
        for (let i = 0; i < options.length; i++) {
          if (options[i] == "") {
            options[i] = human;
            let score = miniMax(newOptions, false);
            options[i] = "";
            bestscore = Math.max(score, bestscore);
          }
        }
        return bestscore;
    }
    else {
        let bestscore = Infinity;
        for (let i = 0; i < options.length; i++) {
          if (options[i] == "") {
            options[i] = ai;
            let score = miniMax(newOptions, true);
            options[i] = "";
            bestscore = Math.min(score, bestscore);
          }
        }
        return bestscore;
    }

}
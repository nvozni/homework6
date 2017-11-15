const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgBoard = document.getElementById('board');
const imgsx = [document.getElementById('xchar1'), document.getElementById('xchar2'), document.getElementById('xchar3')];
const imgso = [document.getElementById('ochar1'), document.getElementById('ochar2'), document.getElementById('ochar3')];

const rand = function(num) {
    return Math.floor(Math.random() * num) + 1;
};

canvas.addEventListener('click', function(evt) {
    //evt.offsetX - x of where the user clicked
    //evt.offsetY - y of where the user clicked
    //Determine which position the user clicked in and call makeMove with that position
    if (isGameOver) {
        return;
    }
    const i = Math.floor(evt.offsetY * board.length / canvas.height);
    const j = Math.floor(evt.offsetX * board.length / canvas.width);
    if (makeMove(board, [i, j], isX) !== -1) {
        update();
    }
}, false);

const update = function() {
    drawBoard(board);
    let result = findWinner(board);
    if (result) {
        alert('Winner: ' + result.winner);
        isGameOver = true;
        return;
    }
    isX = !isX;
    let m = nextMove(board, isX);
    makeMove(board, m, isX);
    isX = !isX;
    drawBoard(board);
    result = findWinner(board);
    if (result) {
        alert('Winner: ' + result.winner);
        isGameOver = true;
        return;
    }
}

// Function checks if there is a row, column or diagonal with 2 given chars
// That means that we must choose the empty position on that row, column or diagonal.
const getWinningPosition = function(board, char) {
    const size = board.length;
    let horizontalCharsCount = 0, verticalCharsCount = 0, horizontalEmptyIndex = -1, verticalEmptyIndex = -1;
    let diagonal1CharsCount = 0, diagonal2CharsCount = 0, diagonal1EmptyIndex = -1, diagonal2EmptyIndex = -1;

    for (let i = 0; i < size; i++) {
        horizontalCharsCount = 0;
        verticalCharsCount = 0;
        horizontalEmptyIndex = -1;
        verticalEmptyIndex = -1;

        // Counting given chars count and empty position on the diagonal 1
        if (board[i][i] === char) {
            diagonal1CharsCount++;
        } else if (board[i][i] === ' ') {
            diagonal1EmptyIndex = i;
        }

        // Counting given chars count and empty position on the diagonal 2
        if (board[i][size - i - 1] === char) {
            diagonal2CharsCount++;
        } else if (board[i][size - i - 1] === ' ') {
            diagonal2EmptyIndex = i;
        }

        for (let j = 0; j < size; j++) {
            // Counting given chars count and empty position on the row i
            if (board[i][j] === char) {
                horizontalCharsCount++;
            } else if (board[i][j] === ' ') {
                horizontalEmptyIndex = j;
            }

            // Counting given chars count and empty position on the column i
            if (board[j][i] === char) {
                verticalCharsCount++;
            } else if (board[j][i] === ' ') {
                verticalEmptyIndex = j;
            }
        }

        // If the i-th row contains 2  chars then we are returning the empty position
        if (horizontalCharsCount === size - 1 && horizontalEmptyIndex !== -1) {
            return [i, horizontalEmptyIndex];
        }

        // If the i-th column contains 2  chars then we are returning the empty position
        if (verticalCharsCount === size - 1 && verticalEmptyIndex !== -1) {
            return [verticalEmptyIndex, i];
        }
    }

    // If the diagonal #1 contains 2  chars then we are returning the empty position
    if (diagonal1CharsCount === size - 1 && diagonal1EmptyIndex !== -1) {
        return [diagonal1EmptyIndex, diagonal1EmptyIndex];
    }

    // If the diagonal #2 contains 2  chars then we are returning the empty position
    if (diagonal2CharsCount === size - 1 && diagonal2EmptyIndex !== -1) {
        return [diagonal2EmptyIndex, size - diagonal2EmptyIndex - 1];
    }
    return null;
};

const isAllFilled = function(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === ' ') {
                return false;
            }
        }
    }
    return true;
};

const findWinner = function(board) {
    const xWinningLine = findWinnerLineByChar(board, 'x');
    if (xWinningLine) {
        return {
            winner: 'x',
            winningLocations: xWinningLine
        }
    }
    const oWinningLine = findWinnerLineByChar(board, 'o');
    if (oWinningLine) {
        return {
            winner: 'o',
            winningLocations: oWinningLine
        }
    }

    if (isAllFilled(board)) {
        return {
            winner: 'none'
        }
    }

    return undefined;
};

const findWinnerLineByChar = function(board, char) {
    const size = board.length;
    let horizontalCharsCount = 0, verticalCharsCount = 0, horizontalLine = [], verticalLine = [];
    let diagonal1CharsCount = 0, diagonal2CharsCount = 0, diagonal1Line = [], diagonal2Line = [];

    for (let i = 0; i < size; i++) {
        horizontalCharsCount = 0;
        verticalCharsCount = 0;
        horizontalLine.length = 0;
        verticalLine.length = 0;

        if (board[i][i] === char) {
            diagonal1CharsCount++;
        }
        diagonal1Line.push([i, i]);

        if (board[i][size - i - 1] === char) {
            diagonal2CharsCount++;
        }
        diagonal2Line.push([i, size - i - 1]);

        for (let j = 0; j < size; j++) {
            if (board[i][j] === char) {
                horizontalCharsCount++;
            }
            horizontalLine.push([i, j]);

            if (board[j][i] === char) {
                verticalCharsCount++;
            }
            verticalLine.push([j, i]);
        }

        if (horizontalCharsCount === size) {
            return horizontalLine;
        }

        if (verticalCharsCount === size) {
            return verticalLine;
        }
    }

    if (diagonal1CharsCount === size) {
        return diagonal1Line;
    }

    if (diagonal2CharsCount === size) {
        return diagonal2Line;
    }
    return null;
};

const getForkPosition = function(board, char) {
    const size = board.length;
    let position;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            position = [i, j];
            if (board[i][j] === ' ') {
                let lines = getPositionLines(board, position);
                if (existsForkInLines(lines, position, char, board.length)) {
                    return position;
                }
            }
        }
    }
    return null;
};

const existsForkInLines = function(lines, position, char, size) {
    let forkLinesCount = 0;
    let charCount;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        charCount = 0;
        for (j = 0; j < line.length; j++) {
            if (line[j] === char) {
                charCount++;
            } else if (line[j] !== ' ') {
                charCount = -1;
                break;
            }
        }

        if (charCount === size - 2) {
            forkLinesCount++;
        }
    }

    return forkLinesCount > 1;
};

const getPositionLines = function(board, position) {
    const lines = [];
    const horizontalLine = [];
    const verticalLine = [];
    const diagonal1Line = [];
    const diagonal2Line = [];
    const size = board.length;
    const row = position[0];
    const col = position[1];
    const isOnDiagonal1 = row === col;
    const isOnDiagonal2 = row === size - col - 1;

    for (let i = 0; i < size; i++) {
        horizontalLine.push([board[row][i]]);
        verticalLine.push([board[i][col]]);
        diagonal1Line.push(board[i][i]);
        diagonal2Line.push(board[i][size - i - 1]);
    }

    lines.push(horizontalLine);
    lines.push(verticalLine);
    if (isOnDiagonal1) {
        lines.push(diagonal1Line);
    }
    if (isOnDiagonal2) {
        lines.push(diagonal2Line);
    }
    return lines;
};

const getOppositeCornerPosition = function(board, char) {
    const size = board.length;
    if (board[0][0] === char && board[size - 1][size - 1] === ' ') {
        return [size - 1, size - 1];
    }
    if (board[0][size - 1] === char && board[size - 1][0] === ' ') {
        return [size - 1, 0];
    }
    if (board[size - 1][0] === char && board[0][size - 1] === ' ') {
        return [0, size - 1];
    }
    if (board[size - 1][size - 1] === char && board[0][0] === ' ') {
        return [0, 0];
    }
    return null;
};

const getEmptyCornerPosition = function(board) {
    const size = board.length;

    if (board[0][0] === ' ') {
        return [0, 0];
    }
    if (board[size - 1][0] === ' ') {
        return [size - 1, 0];
    }
    if (board[0][size - 1] === ' ') {
        return [0, size - 1];
    }
    if (board[size - 1][size - 1] === ' ') {
        return [size - 1, size - 1];
    }
    return null;
};

const getFirstEmptyPosition = function(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === ' ') {
                return [i, j];
            }
        }
    }
};

const nextMove = function(board, isX) {
    const myChar = isX ? 'x' : 'o';
    const oppChar = isX ? 'o' : 'x';
    const size = board.length;
    const winningPosition = getWinningPosition(board, myChar);
    if (winningPosition) {
        return winningPosition;
    }
    const losingPosition = getWinningPosition(board, oppChar);
    if (losingPosition) {
        return losingPosition;
    }
    const winningForkPosition = getForkPosition(board, myChar);
    if (winningForkPosition) {
        return winningForkPosition;
    }
    const losingForkPosition = getForkPosition(board, oppChar);
    if (losingForkPosition) {
        return losingForkPosition;
    }
    const midIndex = Math.floor(size / 2);
    if (board[midIndex][midIndex] === ' ') {
        return [midIndex, midIndex];
    }
    const oppositeCornerPosition = getOppositeCornerPosition(board, oppChar);
    if (oppositeCornerPosition) {
        return oppositeCornerPosition;
    }
    const cornerPosition = getEmptyCornerPosition(board);
    if (cornerPosition) {
        return cornerPosition;
    }
    return getFirstEmptyPosition(board);
};

const makeMove = function(board, position, isX) {
    if (board[position[0]][position[1]] !== ' ') {
        return -1;
    }
    board[position[0]][position[1]] = isX ? 'x' : 'o';
    isX = !isX;
    return 0;
};

const simulate = function() {
    while(true) {
        let position = nextMove(board, isX);
        if (makeMove(board, position, isX) === -1) {
            alert('Invalid move');
            break;
        }
        let result = findWinner(board);
        if (result) {
            alert('Winner: ' + result.winner);
            break;
        }
        isX = !isX;
        printBoard();
    }
    console.log(board);
};

const printBoard = function() {
    let line = '';
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            line = line + board[i][j];
        }
        console.log(line);
        line = '';
    }
};

const drawBoard = function(board) {
    const lineWidth = 10;
    ctx.lineWidth = lineWidth;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal and vertical lines
    for (let i = 0; i < board.length - 1; i++) {
        let x = (i + 1) * canvas.width / board.length - lineWidth / 2;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        let y = (i + 1) * canvas.height / board.length - lineWidth / 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw chars
    let img;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 'x') {
                img = imgsx[rand(3) - 1];
            } else if (board[i][j] === 'o') {
                img = imgso[rand(3) - 1];
            } else {
                continue;
            }

            ctx.drawImage(img,
                j * canvas.width / board.length + canvas.width / 20,
                i * canvas.height / board.length + canvas.height / 20,
                canvas.width / 5, canvas.height / 5);
        }
    }
};

const startNewGame = function() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            board[i][j] = ' ';
        }
    }

    var e = document.getElementById("myChar");
    isX = e.options[e.selectedIndex].value === 'x';
    isGameOver = false;
    if (! isX) {
        let m = nextMove(board, true);
        makeMove(board, m, true);
    }
    drawBoard(board);
};

const board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

let isX = true;
let isGameOver = false;

//simulate();
drawBoard(board);

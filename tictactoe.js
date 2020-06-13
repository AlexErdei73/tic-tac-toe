const gameBoard = function(){

    let board;
    erase();

    function isFieldExistant(col, row){
        let result = false;
        if (col >= 0 && col <= 2) {
            if (row >= 0 && row <= 2) {
                result = true;
            }
        }
        return result;
    }

    function isFieldEmpty(col, row){
        let result = false;
        if (isFieldExistant(col, row)) {
            if (board[row][col] == '') {
                result = true;
            }
        }
        return result;
    }

    function setField(col, row, char){
        if (char != 'x' && char != 'o') return
        if (isFieldEmpty(col, row)) {
            board[row][col] = char;
        } 
    }

    function getField(col, row){
        if (!isFieldExistant(col, row)) return 
        return board[row][col];
    }

    function findWinner(){

        const  directionVectors =  [{'col': 1, 'row':  0},
                                    {'col': 1, 'row':  1},
                                    {'col': 0, 'row':  1},
                                    {'col': -1, 'row':  1},
                                    {'col': -1, 'row':  0},
                                    {'col': -1, 'row':  -1},
                                    {'col': 0, 'row':  -1},
                                    {'col': 1, 'row':  -1}];

        let char = '';
        let newcol = 0;
        let newrow = 0;
        let count = 0;
        let winner = '';
        let isBoardFull = true;

        for (let col = 0; col <= 2; col++){
            for (let row = 0; row <= 2; row++){
                char = getField(col, row);
                if (char != '') {
                    for (let i = 0; i < 8; i++){
                        count = 0;
                        newcol = col;
                        newrow = row;
                        while (count < 3 && char == getField(newcol, newrow)){
                            newcol = newcol + directionVectors[i].col;
                            newrow = newrow + directionVectors[i].row;
                            count++;
                        }
                        if (count == 3) {
                            winner = char;
                        }
                    }
                } else {
                    isBoardFull = false;
                }
            } 
        }
        if (isBoardFull && winner == '') {
            return 'tie';
        } else {
            return winner;
        }
    }

    function erase(){
        board = [['','',''],
                 ['','',''],
                 ['','','']];
        console.table(board);
    }

    return {isFieldEmpty, setField, getField, findWinner, erase};
}();


const displayControl = function(){
    const board = document.querySelector('.gameBoard');
    const btnStart = document.querySelector('#start');
    const btnReset = document.querySelector('#reset');
    const msg = document.querySelector('.message');
    const inputA = document.querySelector('input#a');
    const inputB = document.querySelector('input#b');
    const divScoreA = document.querySelector('.score#a');
    const divScoreB = document.querySelector('.score#b');
    const divNameA = document.querySelector('.name#a');
    const divNameB = document.querySelector('.name#b');
    let isGameOver = false;

    btnStart.addEventListener('click', onClickStart);
    btnReset.addEventListener('click', onClickReset);

    function isBoardReady(){
        if (board.childElementCount == 0) {
            return false;
        } else {
            return true;
        }
    }

    function createField(col, row){
        const div = document.createElement('div');
        div.classList.add('field');
        div.setAttribute('row',row);
        div.setAttribute('col',col);
        board.appendChild(div);
        div.addEventListener('click', onClick);
    }

    function createBoard(){
        if (isBoardReady()) return
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                createField(col, row);
            }
        }
    }

    function styleField(col, row, char, div){
        div.textContent = char.toUpperCase();
        if (char == 'x') {
            div.style = 'text-shadow:0 0 0 darkred';
        } else {
            div.style = 'text-shadow:0 0 0 olive';
        }
    }

    function render(board){
        if (!isBoardReady()) {
            createBoard();
        }
        const divs = document.querySelectorAll('.field');
        divs.forEach(div => {
            const col = div.getAttribute('col');
            const row = div.getAttribute('row');
            const char = board.getField(col, row);
            styleField(col, row, char, div);
        })
    }

    function onClick(e){
        if (isGameOver) return
        const div = e.target;
        const row = div.getAttribute('row');
        const col = div.getAttribute('col');
        const char = game.nextPlayer().char;
        if (gameBoard.isFieldEmpty(col, row)) {
            gameBoard.setField(col, row, char);
            styleField(col, row, char, div);
            game.swapPlayer();
        }
    }

    function stopGame(){
        isGameOver = true;
    }

    function resetGame(){
        isGameOver = false;
        deleteMessage();
    }

    function showMessage(message){
        msg.textContent = message;
    }

    function deleteMessage(){
        msg.textContent = '';
    }

    function showScores(scoreA, scoreB){
        divScoreA.textContent = scoreA.toString();
        divScoreB.textContent = scoreB.toString();
    }

    function onClickStart(){
        gameBoard.erase();
        render(gameBoard);
        resetGame();
    }

    function onClickReset(){
        const nameA = inputA.value;
        const nameB = inputB.value;
        game.reset(nameA, nameB);
        onClickStart();
    }

    function showNames(nameA, nameB){
        divNameA.textContent = nameA;
        divNameB.textContent = nameB;
    }

    function showNextPlayer(name){
        if (name == divNameA.textContent) {
            divNameA.style = 'color: lightgreen; background: darkred;';
            divNameB.style = '';
        } else {
            divNameB.style = 'color: lightgreen; background: olive;';
            divNameA.style = '';
        }
    }

    return {render, stopGame, resetGame, showMessage, showScores, showNames, showNextPlayer};
}();


function player(name, char){
    let score = 0;

    function incScore(){
        score++;
    }

    function delScore(){
        score = 0;
    }

    function getScore(){
        return score;
    }

    return {name, char, incScore, delScore, getScore};
}


const game = function(){
    const playerA = player('Player A','x');
    const playerB = player('Player B','o');
    let playerNext = playerA;

    displayControl.render(gameBoard);
    displayControl.showNextPlayer(playerNext.name);

    function swapPlayer(){
        const winner = gameBoard.findWinner();
        if (winner != '') {
            gameOver(winner);
        } else if (playerNext == playerA) {
                playerNext = playerB;
            } else {
                playerNext = playerA;
            }
        displayControl.showNextPlayer(playerNext.name);
    }

    function showScores(){
        displayControl.showScores(playerA.getScore(), playerB.getScore());
    }

    function gameOver(winner){
        let message = '';
        displayControl.stopGame();
        if (winner == 'tie') {
            message = 'It is a tie!';
        } else {
            message = playerNext.name + ' is the winner!';
            playerNext.incScore();
            showScores();
        }
        displayControl.showMessage(message);
    }

    function nextPlayer() {
        return playerNext;
    }

    function reset(nameA, nameB){
        if (nameA != nameB && nameA != '' && nameB != '') {
            playerA.name = nameA;
            playerB.name = nameB;
            displayControl.showNames(playerA.name, playerB.name);
        }
        playerA.delScore();
        playerB.delScore();
        showScores();
    }

    return {swapPlayer, nextPlayer, reset};
}();

function matrix(col, row) {
    const _create = (amount) => new Array(amount).fill(0);
    const _matrix = (rows, cols) => _create(cols).map((o, i) => _create(rows));
    const _storage = _matrix(row, col);

    function _isElementDefined(cols, rows){
        return (cols >= 0 && cols < col &&
                rows >= 0 && rows < row); 
    }

    function getElement(cols, rows){
        if (!_isElementDefined(cols, rows)) return 
        return _storage[rows][cols];
    }

    function setElement(cols, rows, element){
        if (!_isElementDefined(cols, rows)) return 
        _storage[rows][cols] = element;
    }

    function getMatrix(){
        return _storage;
    }

    function fillUp(element){
        for (let cols = 0; cols < col; cols++){
            for (let rows = 0; rows < row; rows++){
                _storage[rows][cols] = element;
            }
        }
    }

    return { col, row, getElement, setElement, getMatrix, fillUp }
}

const gameBoard = function(){

    const _n = 3;
    
    let _board = matrix(_n, _n);

    function setField(col, row, char){
        _board.setElement(col, row, char);   
    }

    function getField(col, row){
        return _board.getElement(col, row);
    }

    function erase(){
       _board.fillUp(''); 
    }

    function getN(){
        return _n;
    }

    function getBoard(){
        return _board.getMatrix();
    }

    erase();
    return { getN, setField, getField, erase, getBoard };
}();

const displayBoard = function(board){

    const n = board.getN();

    function _getField(col, row){
        return board.getField(col, row);
    }

    function _move(col, row){
        gameControl.move(col, row);
    }

    const gameBoardDiv = document.querySelector('.gameBoard');
    let isGameOver = false;

    function _createField(col, row){
        const div = document.createElement('div');
        div.classList.add('field');
        div.setAttribute('row',row);
        div.setAttribute('col',col);
        gameBoardDiv.appendChild(div);
        div.addEventListener('click', _onClick);
    }

    function _createBoard(n){
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                _createField(col, row);
            }
        }
    }

    function _fillInField(char, div){
        div.textContent = char.toUpperCase();
    }

    function _styleField(char, div){
        if (char == 'x') {
            div.style = 'text-shadow:0 0 0 darkred';
        } else {
            div.style = 'text-shadow:0 0 0 rgb(0, 32, 0)';
        }
    }

    function render(){
        const divs = document.querySelectorAll('.field');
        divs.forEach(div => {
            const col = div.getAttribute('col');
            const row = div.getAttribute('row');
            const char = _getField(col, row);
            _fillInField(char, div);
            _styleField(char, div);
        });
    }

    function _onClick(e){
        if (isGameOver) return
        const div = e.target;
        const row = div.getAttribute('row');
        const col = div.getAttribute('col');
        if (_getField(col, row) == '') {
            _move(col, row);
        }
    }

    _createBoard(n);
    return { render };
}(gameBoard);

const displayPlayers = function(){

    const msg = document.querySelector('.message');
    const divScoreA = document.querySelector('.score#a');
    const divScoreB = document.querySelector('.score#b');
    const divNameA = document.querySelector('.name#a');
    const divNameB = document.querySelector('.name#b');

    function showMessage(message){
        msg.textContent = message;
    }

    function showScores(scoreA, scoreB){
        divScoreA.textContent = scoreA;
        divScoreB.textContent = scoreB;
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
            divNameB.style = 'color: lightgreen; background: rgb(0, 32, 0);';
            divNameA.style = '';
        }
    }

    return { showMessage, showScores, showNames, showNextPlayer }
}();

const boardEvaluation = function(gameboard){

    const _n = gameboard.getN();

    function winner(board){

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
        let out = false;
        for (let col = 0; col < _n; col++){
            for (let row = 0; row < _n; row++){
                char = board[row][col];
                if (char != '') {
                    for (let i = 0; i < 8; i++){
                        count = 0;
                        newcol = col;
                        newrow = row;
                        out = false;
                        while (count < 3 && !out && char == board[newrow][newcol]){
                            newcol = newcol + directionVectors[i].col;
                            newrow = newrow + directionVectors[i].row;
                            out = newrow < 0 || newrow >= _n || newcol < 0 || newcol >= _n;
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

    return { winner }
}(gameBoard);

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

const computer = function(board, eval){

    const n = board.getN();
    const _maxDepth = n*n - 1;
    let gameboard;

    function _getBoard(){
        gameboard = board.getBoard();
    }

    function winner(gboard){
        return eval.winner(gboard);
    }

    function randomMove() {
        let col = 0;
        let row = 0;
        _getBoard();
        do {
            col = Math.floor(n * Math.random());
            row = Math.floor(n * Math.random());
        } 
        while (gameboard[row][col] != '');
        return { col, row }
    }

    function _minimax(depth, isPlayerComputer) {
        const win = winner(gameboard);
        let value = 0;
        let char = '';
        let newValue = 0;
        let isTerminalNode = true;
        let bestMove;
        switch (win) {
            case 'x':
                value = -1;
            break;
            case 'o':
                value = 1;
            break;
            case 'tie':
                value = 0;
            break;
            case '':
                isTerminalNode = false;
            break;
        }
        if (depth == 0 || isTerminalNode) {
            return value;
        } else {
            if (isPlayerComputer) {
                value = -1;
                char = 'o';
            } else {
                value = 1;
                char = 'x';
            }
            for (let col = 0; col < n; col++){
                for (let row = 0; row < n; row++){
                    if (gameboard[row][col] == '') {
                        gameboard[row][col] = char;
                        newValue = _minimax(depth - 1, !isPlayerComputer);
                        if ((newValue > value && isPlayerComputer) || (newValue < value && !isPlayerComputer)) {
                            value = newValue;
                            bestMove = {col, row, value};
                        }
                        gameboard[row][col] = '';
                    }
                }
            }
            if (depth == _maxDepth) {
                return bestMove;
            } else {
                return value;
            }
        }
    }

    function bestMove(){
        _getBoard();
        return _minimax(_maxDepth, true);
    }

    return { randomMove, bestMove }
}(gameBoard, boardEvaluation);

const players = function(evaluation){

    function _winner(){
        return evaluation.winner(gameBoard.getBoard());
    }

    const playerA = player('Player A','x');
    const human = player('Player B','o');
    const _computer = player('Computer','o');
    let _playerB = human;
    let _playerNext = playerA;

    function getPlayerNext(){
        return _playerNext;
    }

    function getOpponent(){
        return _playerB;
    }

    function toggleOpponent(){
        if (_playerB == human) {
            _playerB = _computer;
        } else {
            _playerB = human;
        }
    }

    function toggleNext(){
        if (_playerNext == playerA) {
            _playerNext = _playerB;
        } else {
            _playerNext = playerA;
        }
    }

    return { playerA, human, getPlayerNext, getOpponent, toggleOpponent, toggleNext  }
}(boardEvaluation);

const gameControl = function(board, dispBoard, dispPlayers, players, eval){

    function _setField(col, row, char){
        return board.setField(col, row, char);
    }

    function _erase(){
        board.erase();
    }

    function _render(){
        dispBoard.render();
    }

    function _showNextPlayer(){
        return dispPlayers.showNextPlayer(_getPlayerNext().name);
    }

    function _showScores(){
        dispPlayers.showScores(_playerA.getScore(), _getPlayerB().getScore());
    }

    function _showMessage(){
        dispPlayers.showMessage(_message(_win));
    }

    function _delMessage(){
        dispPlayers.showMessage('');
    }

    function _showNames(){
        dispPlayers.showNames(_playerA.name, _getPlayerB().name);
    }

    const _playerA = players.playerA;
    const _human = players.human;

    function _getPlayerB(){
        return players.getOpponent();
    } 

    function _getPlayerNext(){
        return players.getPlayerNext();
    }

    function toggleOpponent(){
        _isComputerPlaying = !_isComputerPlaying;
        players.toggleOpponent();
    }

    function _toggleNext(){
       players.toggleNext();
    }

    function _winner(){
        return eval.winner(board.getBoard());
    }

    function _incScore(){
        if (_win != 'tie') {
            _getPlayerNext().incScore();
        }
    }

    function _computerMove(){
        if (!_isComputerPlaying || _getPlayerNext() == _playerA) return
            const bestMove = computer.bestMove();
            move(bestMove.col, bestMove.row);
    }

    let _isGameStopped = false;
    let _win = '';
    let _isComputerPlaying = false;
    _showNextPlayer();
    _showScores();

    function move(col, row){
        if (_isGameStopped) return
        const char = _getPlayerNext().char;
        _setField(col, row, char);
        _render();
        if (_isGameOver()) {
            _stop();
            _showMessage();
            _incScore();
            _showScores();
        } else {
            _toggleNext();
            _showNextPlayer();
            _computerMove();
        }
    }

    function _isGameOver(){
        _win = _winner();
        if (_win != '') {
            return true;
        } else {
            return false;
        }
    }

    function _message(winner){
        let message = '';
        if (winner == 'tie') {
            message = 'It is a tie!';
        } else {
            message = _getPlayerNext().name + ' is the winner!';    
        }
        return message;
    }

    function _stop(){
        _isGameStopped = true;
    }

    function start(){
        _isGameStopped = false;
        _delMessage();
        _showScores();
        if (_isComputerPlaying && _getPlayerNext() !=  _playerA) {
            _toggleNext();
            _showNames();
        }
        _erase();
        _render();
    }

    function updateNames(nameA, nameB){
        if (nameA != nameB && nameA != '' && nameB != '') {
            _playerA.name = nameA;
            _human.name = nameB;
            _showNames();
        }
    }

    function reset(){
        _playerA.delScore();
        _getPlayerB().delScore();
        _showScores();
        start();
    }

    return { move, start, updateNames, reset, toggleOpponent };
}(gameBoard, displayBoard, displayPlayers, players, boardEvaluation);

const displayButtons = function(control){

    function _onClickStart(){
        control.start();
    }

    function _updateNames(nameA, nameB){
        control.updateNames(nameA, nameB);
    }

    function _onClickReset(){
        control.reset();
    }

    function _toggleOpponent(){
        control.toggleOpponent();
    }

    const inputA = document.querySelector('input#a');
    const inputB = document.querySelector('input#b');
    const btnStart = document.querySelector('#start');
    const btnReset = document.querySelector('#reset');
    const btnAi = document.querySelector('#ai');
    
    inputA.addEventListener('blur', _changeNames);
    inputB.addEventListener('blur', _changeNames);
    btnStart.addEventListener('click', _onClickStart);
    btnReset.addEventListener('click', _onClickReset);
    btnAi.addEventListener('click', _onClickAi); 

    function _changeNames() {
        const nameA = inputA.value;
        const nameB = inputB.value;
        _updateNames(nameA, nameB);
    }

    function _onClickAi(){
        _toggleOpponent();
        _onClickReset();
    }
    
    return {};
}(gameControl);
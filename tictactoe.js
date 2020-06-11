const gameBoard = function(){

    let board = [['','',''],
                 ['','',''],
                 ['','','']];

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
        if (isFieldExistant) {
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
        if (!isFieldExistant) return
        return board[row][col];
    }

    return {isFieldEmpty, setField, getField};
}();

const displayControl = function(){
    const board = document.querySelector('.gameBoard');

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
        console.log(div);
    }

    function createBoard(){
        if (isBoardReady()) return
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                createField(col, row);
            }
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
            div.textContent = char;
            if (char == 'x') {
                div.style = 'color: darkred';
            } else {
                div.style = 'color: olive';
            }
        })
    }

    return{render};
}();

gameBoard.setField(0, 0, 'x');
gameBoard.setField(2, 1, 'o');
displayControl.render(gameBoard);

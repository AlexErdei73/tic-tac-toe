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

gameBoard.setField(0, 0, 'x');
gameBoard.setField(2, 1, 'o');
let str = '';
for (let i = 0; i <= 2; i++) {
    str = '';
    for (let j = 0; j <= 2; j++) {
        if (gameBoard.isFieldEmpty(j, i)) {
            str = str + '_';
        } else {
            str = str + gameBoard.getField(j, i);
        }
    }
    console.log(str);
}

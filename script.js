const player = function(name, symbol){
    return {name, symbol};
}

const gameBoard = (function(){
    let board = ['', '', '', '', '', '', '', '', ''];
    let current = 'X';

    const modifyBoard = (index) => {
        if(board[index] == ''){
            board[index] = current;
        }
        toggleCurrent();
        
        let winner = determineWinner();
        if(winner){
            endGame(winner);
        } else{
            return;
        }
    }

    const toggleCurrent = () => {
        if(current == 'X'){
            current = 'O';
        }else{
            current = 'X';
        }
    }
    const getCurrent = () => {
        return current;
    }

    const endGame = (winner) => {
        if(winner == 'Tie'){
            console.log("It's a tie!");
        } else {
            let winnerPlayer = gameModule.findPlayer(winner);
            console.log(winnerPlayer.name + " is the winner");
        }
    }

    const determineWinner = () => {
        if(
            board[0] == 'X' && board[1] == 'X' && board[2] == 'X' ||
            board[3] == 'X' && board[4] == 'X' && board[5] == 'X' || 
            board[6] == 'X' && board[7] == 'X' && board[8] == 'X' ||
            board[0] == 'X' && board[3] == 'X' && board[6] == 'X' ||
            board[1] == 'X' && board[4] == 'X' && board[7] == 'X' ||
            board[2] == 'X' && board[5] == 'X' && board[8] == 'X' ||
            board[0] == 'X' && board[4] == 'X' && board[8] == 'X' ||
            board[2] == 'X' && board[4] == 'X' && board[6] == 'X'
        ){
            return 'X';
        } else if(
            board[0] == 'O' && board[1] == 'O' && board[2] == 'O' ||
            board[3] == 'O' && board[4] == 'O' && board[5] == 'O' || 
            board[6] == 'O' && board[7] == 'O' && board[8] == 'O' ||
            board[0] == 'O' && board[3] == 'O' && board[6] == 'O' ||
            board[1] == 'O' && board[4] == 'O' && board[7] == 'O' ||
            board[2] == 'O' && board[5] == 'O' && board[8] == 'O' ||
            board[0] == 'O' && board[4] == 'O' && board[8] == 'O' ||
            board[2] == 'O' && board[4] == 'O' && board[6] == 'O'
        ){
            return 'O';
        } else if(board.indexOf('') > 0){
            return false;
        } else{
            return 'Tie';
        }
    }

    return {
        modifyBoard,
        getCurrent,
        board
    }
    
})();

const gameModule = (function(){
    let playerNames = {
        playerX: '',
        playerO: ''
    }
    const startBtn = document.getElementById('start-btn');
    const nameForm = document.getElementById('name-form');
    const boardElement = document.getElementById('board');
    const turnElement = document.getElementById('turn');

    const bindEvents = () => {
        startBtn.addEventListener('click', viewForm);    
        document.getElementById('confirm-names').addEventListener('click', getNames);    
    }
    const viewForm = () => {
        nameForm.style.visibility="visible";
        startBtn.style.visibility = 'hidden';
    }
    const getNames = () => {
        playerNames.playerX = document.getElementById('x-name').value || 'X';
        playerNames.playerO = document.getElementById('o-name').value || 'O';
        nameForm.style.visibility = 'hidden';
        startGame();
    }
    const startGame = () => {
        boardElement.style.visibility = 'visible';
        turnElement.style.visibility = 'visible';
        displayController.render();
    }
    const findPlayer = (symbol) => {
        return symbol == 'X' ? player(playerNames.playerX, 'X') : player(playerNames.playerO, 'O');
    }

    bindEvents();

    return{
        findPlayer
    }
})();


const displayController = (function(){
    const squares = document.querySelectorAll('.board-square');
    const turnDisplay = document.getElementById('turn-display');

    const bindEvents = () => {
        squares.forEach((square) => {
            square.addEventListener('click', handleClick);
        });
    }
    const handleClick = (e) => {
        gameBoard.modifyBoard(e.target.id);
        render();
    }
    const render = () => {
        gameBoard.board.forEach((item, index) => {
            squares[index].innerHTML = item;
        });
        turnDisplay.innerHTML = gameModule.findPlayer(gameBoard.getCurrent()).name;
    }

    bindEvents();

    return {
        render
    };
})();

const gameBoard = (function(){
    let board= ['', '', '', '', '', '', '', '', ''];
    let current = 'X';
    const modifyBoard = (index) => {
        if(board[index] == ''){
            board[index] = current;
        } else {
            return;
        }
        current = _toggleCurrent();
        
        let winner = _determineWinner();
        if(winner != false){
            _endGame(winner);
        } else {
            return;
        }
    }
    const _toggleCurrent = () => {
        return current == 'X' ? 'O' : 'X';
    }    
    const _endGame = (winner) => {
        if(winner == 'Tie'){
            displayController.endGame(`It's a tie!`);
        } else {
            let winnerPlayer = gameModule.findPlayer(winner);
            displayController.endGame(`${winnerPlayer.name} is the winner!`);
        }
    }
    const _determineWinner = () => {
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
        } else if(board.indexOf('') >= 0){
            return false;
        } else{
            return 'Tie';
        }
    }   
    const getCurrent = () => {
        return current;
    }
    const getBoard = () => {
        return board;
    }
    return {
        modifyBoard,
        getCurrent,
        getBoard,
    }
    
})();

//factory for player
const player = function(name, symbol){
    return {
        name,
        symbol
    };
}

const gameModule = (function(){
    let playerNames = {
        playerX: '',
        playerO: ''
    }
    const startGame = () => {
        playerNames = displayController.getNames();
        displayController.viewBoard();
        displayController.render();
    }
    const findPlayer = (symbol) => {
        return symbol == 'X' ? player(playerNames.playerX, 'X') : player(playerNames.playerO, 'O');
    }

    return{
        startGame,
        findPlayer
    }
})();


const displayController = (function(){
    const squares = document.querySelectorAll('.board-square');
    const turnDisplay = document.getElementById('turn-display');
    const nameForm = document.getElementById('name-form');
    const boardElement = document.getElementById('board');
    const turnElement = document.getElementById('turn');
    const confirmNames = document.getElementById('confirm-names');
    const replayBtn = document.getElementById('replay');

    const _bindEvents = () => {
        squares.forEach((square) => {
            square.addEventListener('click', _handleClick);
        });
        confirmNames.addEventListener('click', gameModule.startGame);
        replayBtn.addEventListener('click', _replayGame);  
    }
    const _removeEvents = () => {
        squares.forEach((square) => {
            square.removeEventListener('click', _handleClick);
        });
    }
    const _handleClick = (e) => {
        gameBoard.modifyBoard(e.target.id);
        render();
    }
    const _replayGame = () => {
        location.reload();
    }

    const render = () => {
        gameBoard.getBoard()    .forEach((item, index) => {
            squares[index].innerHTML = item;
        });
        turnDisplay.innerHTML = `${gameModule.findPlayer(gameBoard.getCurrent()).name}'s turn`;
    }
    const viewBoard = () => {
        nameForm.style.display = 'none';
        boardElement.style.display = 'flex';
        turnElement.style.display = 'block';
        turnDisplay.style.display = 'block';
        replayBtn.style.display = 'block';
    }
    const getNames = () => {
        return {
            playerX: document.getElementById('x-name').value || 'X',
            playerO: document.getElementById('o-name').value || 'O'
        }
    }
    const endGame = (message) => {
        _removeEvents();
        turnElement.innerHTML = message;
    }

    _bindEvents();

    return {
        render,
        viewBoard,
        getNames,
        endGame
    };
})();

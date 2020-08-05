//board module where everything concerning the board is handeled.
const gameBoard = (function(){
    let board= ['', '', '', '', '', '', '', '', ''];
    let current = 'X';
    const victoryCombs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    //resets the current player and board.
    const resetData = () => {
        current = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
    }

    //executes when a square on the board is clicked
    const modifyBoard = (index) => {
        //if the square is empty, set it to the current player. else do nothing.
        if(board[index] == ''){
            board[index] = current;
        } else {
            return;
        }
        //check if there is a winner and if so, end the game.
        let winner = _determineWinner(current);
        if(winner.winner){
            _endGame(winner);
        } else {
            current = _toggleCurrent();
        }
    }
    //method that changes the current player
    const _toggleCurrent = () => {
        return current == 'X' ? 'O' : 'X';
    }    
    const _endGame = (winner) => {
        if(winner.winner == 'Tie'){
            displayController.endGame(`It's a tie!`, winner.winningCombo);
        } else {
            let winnerPlayer = gameModule.findPlayer(winner.winner);
            displayController.endGame(`${winnerPlayer.name} is the winner!`, winner.winningCombo);
        }
    }
    const _determineWinner = (player) => {
        let winner;
        let winningCombo;
        for (let i = 0; i < victoryCombs.length; i++) {
            const combo = victoryCombs[i];
            if(board[combo[0]] == player && board[combo[1]] == player && board[combo[2]] == player){
                winner = player;
                winningCombo = victoryCombs[i];
                break;
            } else if(board.indexOf('') >= 0){
                winner = false;
            } else{
                winner = 'Tie';
            }
        }
        return {
            winner,
            winningCombo
        };
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
        resetData
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
    const winnerDisplay = document.getElementById('winner-display');
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
        gameBoard.resetData();
        _bindEvents();
        highlightSquares(false);
        viewBoard();
        render();
        //location.reload();
    }

    const render = () => {
        gameBoard.getBoard().forEach((item, index) => {
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
        winnerDisplay.style.display = 'none';
    }
    const getNames = () => {
        return {
            playerX: document.getElementById('x-name').value || 'X',
            playerO: document.getElementById('o-name').value || 'O'
        }
    }
    const endGame = (message, combo) => {
        _removeEvents();
        highlightSquares(combo);
        turnDisplay.style.display = 'none';
        winnerDisplay.style.display = 'block';
        winnerDisplay.innerHTML = message;
    }
    const highlightSquares = (array) => {
        if(!array){
            gameBoard.getBoard().forEach((item, index) => {
                document.getElementById(index).style.background = '#F4F4F4';
            });
            return;
        }
        array.forEach((square) => {
            document.getElementById(square).style.background = 'rgba(0, 50, 100, 0.2)';
        });
    }

    _bindEvents();

    return {
        render,
        viewBoard,
        getNames,
        endGame
    };
})();

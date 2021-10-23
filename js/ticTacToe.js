const Player = (name, piece) => {
  return {name, piece}
}

// Update Board, track moves, prevent replacement
const board = (() => {
  const memory = new Array(9).fill('')

  const update = (target, i, piece) => {
    memory[i] = piece 
    target.innerText = piece
  }

  return {
    memory,
    update
  }
})()

// Control game logic
// turns, wins/draws
const controller = (() => {
  const elem_board = document.querySelector('.board')
  const playerOne = Player('p1', 'X')
  const playerTwo = Player('p2', 'O')
  let currentPlayer = playerOne

  const isWin = (piece) => {
    let winConditions = [
      [board.memory[0], board.memory[1], board.memory[2]],
      [board.memory[0], board.memory[4], board.memory[8]],
      [board.memory[0], board.memory[3], board.memory[6]],
      [board.memory[1], board.memory[4], board.memory[7]],
      [board.memory[3], board.memory[4], board.memory[5]],
      [board.memory[6], board.memory[4], board.memory[2]],
      [board.memory[2], board.memory[5], board.memory[8]],
      [board.memory[6], board.memory[7], board.memory[8]],
    ]

    return winConditions
      .map((arr) => {
        return arr
          .map(value => value == piece)
          .reduce((preBool, curBool) => preBool && curBool)
      })
      .reduce((preBool, curBool) => preBool || curBool)
  }

  const isDraw = (isWinner) => {
    return !isWinner && board.memory.reduce((preTile, curTile) => Boolean(preTile) && Boolean(curTile))
  }

  elem_board.addEventListener('click', (e) => {
    let targetElem = e.target
    let targetIndex = targetElem.dataset.index
    let currentPiece = currentPlayer.piece
    let winner = false
    
    if (!board.memory[targetIndex]) {
      board.update(targetElem, targetIndex, currentPiece)
      if (isWin(currentPiece)) {
        winner = true
        console.log(`${currentPlayer.name} Wins!`)
      } else if (isDraw(winner)) {
        console.log(`It's a draw!`)
      } else {
        currentPlayer = (currentPlayer.name == 'p1')
          ? playerTwo
          : playerOne
      }
    }
  })

  return {
    playerOne,
    playerTwo
  }
})()
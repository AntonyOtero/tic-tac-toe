const Player = (name, piece) => {
  let icon
  if (piece == "X") {
    icon = `
    <svg width="50px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path></svg>`
  } else if(piece == 'O'){
    icon = `
    <svg width="55px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="o" class="svg-inline--fa fa-o" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 32.01c-123.5 0-224 100.5-224 224s100.5 224 224 224s224-100.5 224-224S347.5 32.01 224 32.01zM224 416c-88.22 0-160-71.78-160-160s71.78-159.1 160-159.1s160 71.78 160 159.1S312.2 416 224 416z"></path></svg>`
  }
  return {name, piece, icon}
}

// Update Board, track moves, prevent replacement
const board = (() => {
  const memory = new Array(9).fill('')

  const update = (target, i, piece, icon) => {
    memory[i] = piece 
    target.innerHTML = icon
  }

  return {
    memory,
    update
  }
})()

// Control game logic, turns, wins/draws
const controller = (() => {
  const start_button = document.querySelector('.start-btn')
  const select_names = document.querySelector('.select-names')
  const usernames = document.querySelectorAll('.select-names input')
  const elem_board = document.querySelector('.board')
  let playerOne
  let playerTwo
  let currentPlayer

  start_button.addEventListener('click', () => {
    playerOne = Player(usernames[0].value, 'X')
    playerTwo = Player(usernames[1].value, 'O')
    select_names.classList.toggle('not-visible')
    start_button.classList.toggle('not-visible')
    elem_board.classList.toggle('not-visible')
    currentPlayer = playerOne
    console.log(playerOne.name, playerTwo.name)
  })


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

    let testResults = winConditions
      .map((arr) => {
        return arr
          .map(value => value == piece)
          .reduce((preBool, curBool) => preBool && curBool)
      })
    
    return testResults.indexOf(true) > -1
  }

  const isDraw = (isWinner) => {
    return !isWinner && board.memory.reduce((preTile, curTile) => Boolean(preTile) && Boolean(curTile))
  }

  elem_board.addEventListener('click', (e) => {
    console.log(e.target)
    let targetElem = e.target
    let targetIndex = targetElem.dataset.index
    let currentPiece = currentPlayer.piece
    let currentIcon = currentPlayer.icon
    let winner = false
    
    if (!board.memory[targetIndex]) {
      board.update(targetElem, targetIndex, currentPiece, currentIcon)
      if (isWin(currentPiece)) {
        winner = true
        console.log(`${currentPlayer.name} Wins!`)
      } else if (isDraw(winner)) {
        console.log(`It's a draw!`)
      } else {
        currentPlayer = (currentPlayer.piece == 'X')
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
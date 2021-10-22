const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', '']
  
  const display = () => {
    let boardElem = document.createElement('div')
    boardElem.classList.add('board')
    for (let i = 0; i < board.length; i++) {
      let squareElem = document.createElement('div')
      squareElem.classList.add('square')
      boardElem.appendChild(squareElem)
    }
    return document.querySelector('main').appendChild(boardElem)
  }

  return {display}
})()

const gameLoop = (() => {
  
})()

const Player = (name) => {
  return {name}
}

const playerOne = Player('P1')
const playerTwo = Player('P2')

const SQUARES = document.querySelectorAll('.square')

SQUARES.forEach((square, i) => {
  square.addEventListener('click', () => {
    console.log({ i, square })
    square.innerHTML = 'X'
  })
})

gameBoard.display()

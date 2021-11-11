
// Factory Function to generate Player objects
// containing their custom username, token (svg)
// and the character representation of their token for
// tracking memory
const Player = (name, symbol) => {
  // Assign the player a token (svg) based on their symbol
  let token
  if (symbol == "X") {
    token = `
    <svg width="50px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path></svg>`
  } else if(symbol == 'O'){
    token = `
    <svg width="55px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="o" class="svg-inline--fa fa-o" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 32.01c-123.5 0-224 100.5-224 224s100.5 224 224 224s224-100.5 224-224S347.5 32.01 224 32.01zM224 416c-88.22 0-160-71.78-160-160s71.78-159.1 160-159.1s160 71.78 160 159.1S312.2 416 224 416z"></path></svg>`
  }
  return {name, symbol, token}
}

// Function using the Module Pattern
// Responsible for updating the memory and checking for
// a win or a draw (backend)
const gameboard = (() => {
  const memory = new Array(9).fill('')
  const winConditions = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [3, 4, 5],
    [6, 4, 2],
    [2, 5, 8],
    [6, 7, 8],
  ]

  const checkWin = (symbol, tiles) => {
    const testResults = winConditions
    // replace each array with a boolean representing
    // whether or not the condition was met
    .map(condition => {
      return condition
      // replace the indices in the condition with
      // the symbols held in the memory at those indices
      .map(index => memory[index] == symbol)
      // reduce the resulting array of symbols into a
      // boolean representing whether or not each array
      // contains 3 matching symbols
      .reduce((preBool, curBool) => preBool && curBool)
    })
    
    // If a winning condition was met then return the
    // winning condition
    if(testResults.indexOf(true) > -1) {
      let conditionMet = winConditions[testResults.indexOf(true)]
      return conditionMet
    } else {
      return false
    }
  }
  
  const checkDraw = (symbol, tiles) => {
    // Check to see if the memory is full
    let isMaxed = memory
    .reduce((preTile, curTile) => Boolean(preTile) && Boolean(curTile))
    
    return !checkWin(symbol, tiles) && isMaxed
  }
  
  const addToMemory = (index, symbol, tiles) => {
    memory[index] = symbol
    checkWin(symbol, tiles)
  }
  
  const removeFromMemory = (index) => {
    memory[index] = ''
  }
  
  return {
    addToMemory,
    removeFromMemory,
    checkWin,
    checkDraw
  }
})()

// Function using a Module Pattern
// Reponsible for updating the UI based on data passed
// from Player objects and the gameboard module (frontend)
const displayController = (() => {
  // Elements and Components
  const naming_component = document.querySelector(".usernames")
  const options_component = document.querySelector(".options")
  const start_button = document.querySelector(".start")
  const restart_button = document.querySelector(".restart")
  const back_button = document.querySelector(".back")
  const results_component = document.querySelector(".results")
  const board_component = document.querySelector(".gameboard")
  const tiles = [...board_component.children]
  // Displays
  const namingDisplay = [naming_component, start_button]
  const playDisplay = [board_component]
  const resultsDisplay = [results_component, restart_button, back_button]
  // Data
  const usernames = naming_component.querySelectorAll("input")
  let playerOne
  let playerTwo
  let currentPlayer

  // Methods
  const toggleDisplay = (elems) => {
    elems.forEach(elem => {
      elem.classList.toggle("not-visible")
    })
  }

  const changeCurrentPlayer = () => {
    currentPlayer = (currentPlayer == playerOne) ?
      playerTwo :
      playerOne
  }

  const updateBoard = (elem, index, symbol, token) => {
    gameboard.addToMemory(index, symbol, tiles)
    elem.innerHTML = token
  }

  const clearBoard = () => {
    tiles.forEach((tile, i) => {
      gameboard.removeFromMemory(i)
      tile.innerHTML = ''
    })
  }

  const highlightWin = (winningCondition) => {
    winningCondition.forEach(index => {
      tiles[index].lastChild.style.color = "var(--color-highlight)"
    })
  }

  // Initialize
  toggleDisplay(namingDisplay)

  const initializeGame = () => {
    currentPlayer = playerOne
    clearBoard()
    board_component.classList.remove("disabled")
  }

  // Event Listeners
  start_button.addEventListener("click", () => {
    playerOne = Player(usernames[0].value, "X")
    playerTwo = Player(usernames[1].value, "O")
    initializeGame()
    toggleDisplay(namingDisplay)
    toggleDisplay(playDisplay)
  })
  
  restart_button.addEventListener("click", () => {
    initializeGame()
    toggleDisplay(resultsDisplay)
  })

  back_button.addEventListener("click", () => {
    toggleDisplay(playDisplay)
    toggleDisplay(resultsDisplay)
    toggleDisplay(namingDisplay)
  })

  tiles.forEach(tile => {
    tile.addEventListener("click", (e) => {
      const selectedTile = e.target
      
      // If a tile is empty
      if(!selectedTile.innerHTML) {
        updateBoard(
          selectedTile,
          selectedTile.dataset.index,
          currentPlayer.symbol,
          currentPlayer.token
        )
      }

      let winResults = gameboard.checkWin(currentPlayer.symbol, tiles)
      let isWin = Boolean(winResults)
      let isDraw = gameboard.checkDraw(currentPlayer.symbol, tiles)

      if(isWin) {
        let currentName = (currentPlayer.name) ? 
          currentPlayer.name :
          currentPlayer.symbol
        results_component.innerHTML = `${currentName} wins!`
        board_component.classList.add("disabled")
        highlightWin(winResults)
        toggleDisplay(resultsDisplay)
      } else if(isDraw) {
        results_component.innerHTML = `It's a draw!`
        toggleDisplay(resultsDisplay)
      }

      changeCurrentPlayer()
    })
  })

  
  // return {}
})()


document.addEventListener("resize", () => {
  document.body.style.backgroundColor = "red"
})
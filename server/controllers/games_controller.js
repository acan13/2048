var Game = require('../models/Game.js')
var Score = require('../models/Score.js')
var session = require('express-session')

module.exports = {
  create: (req,res) => {
    console.log('running create')
    board = []
    board.push([null, null, null, null])
    board.push([null, null, null, null])
    board.push([null, null, null, null])
    board.push([null, null, null, null])

    generateRandom(board)
    generateRandom(board)

    session.board = board
    session.moves = 0
    session.score = 0

    //temporary
    board = []
    board.push([16, 2, 4, 2])
    board.push([8, 64, 32, 16])
    board.push([4, 8, 16, 2])
    board.push([2, 32, 4, 2])
    session.board = board
    //end temporary
    return res.json({
      board:session.board,
      score:session.score,
      moves:session.moves
    })
  },
  show: (req,res) => {
    console.log('running show')
    if ('board' in session) {
      return res.json({
        board:session.board,
        score:session.score,
        moves:session.moves
      })
    } else {
      console.log('redirecting to create')
      return res.redirect('/games/create')
    }

  },
  destroy: (req,res) => {
    return res.render('games/destroy')
  },

  move: (req,res) => {
    console.log('running move')
    console.log('key press', req.params.key)
    var oldBoard = arrCopy(session.board)
    var move = mover(session.board, req.params.key)
    if (!arrEqual(oldBoard,session.board)) {
      console.log('boards were different')
      session.moves+=1
      generateRandom(session.board)
      session.score += move.score
      var newHigh = false
      var newLow = false
      var gameOver = false
      console.log('starting findone for high')
      Score.findOne({scoreName:"highScore"}, (err, highScore) => {
        if (err) {
          console.log('error finding high score')
          return res.json(err)
        } else if (session.score > highScore.score || highScore.userName === '') {
          highScore.score = session.score
          highScore.moves = session.moves
          highScore.board = session.board
          highScore.userName = ''
          highScore.save((error) => {
            if (error) {
              console.log('error saving new high score',error)
              return res.json(error)
            }
          })
          newHigh = true
        }
        console.log('finished findone for high')
        if (!canMove(session.board)) {
          if (highScore.userName === "") {
            highScore.userName = "anonymous"
            highScore.save((error) => {
              if (error) {
                console.log('error saving high score',error)
                return res.json(error)
              }
            })
          }
          console.log('Game Over')
          gameOver = true
          Score.findOne({scoreName:"lowScore"}, (err, lowScore) => {
            if (err) {
              console.log('error finding low score')
              return res.json(err)
            } else if (session.score < lowScore.score) {
              newLow = true
              lowScore.score = session.score
              lowScore.moves = session.moves
              lowScore.board = session.board
              lowScore.userName = "anonymous"
              lowScore.save((error) => {
                if (error) {
                  console.log('error saving low score',error)
                  return res.json(error)
                }
              })
            }
            return res.json({
              board:session.board,
              score:session.score,
              moves:session.moves,
              newHigh:newHigh,
              newLow:newLow,
              gameOver:gameOver
            })
          })
        } else {
          return res.json({
            board:session.board,
            score:session.score,
            moves:session.moves,
            newHigh:newHigh,
            newLow:newLow,
            gameOver:gameOver
          })
        }
      })
    }

  },

  reset: (req,res) => {
    console.log('running reset')
    return res.redirect('/games/create')
  }
}

// Helper functions

function canMove(board){
  console.log('running canMove')
  // console.log('board:',board)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] === null) {
        return true
      }
      if (i-1 > 0 && board[i][j] === board[i-1][j]) {
        return true
      }
      if (i+1 < board.length && board[i][j] === board[i+1][j]) {
        return true
      }
      if (j-1 > 0 && board[i][j] === board[i][j-1]) {
        return true
      }
      if (j+1 < board.length && board[i][j] === board[i][j+1]) {
        return true
      }
    }
  }
  return false
}

function mover(session_board, key) {
  console.log('running mover')
  var score = 0
  switch (key) {
    case "ArrowLeft":
      rowStart = 0
      colStart = 0
      rowCheck = 1
      colCheck = 0
      break;
    case "ArrowUp":
      rowStart = 0
      colStart = 0
      rowCheck = 0
      colCheck = 1
      break;
    case "ArrowRight":
      rowStart = board.length-1
      colStart = board.length-1
      rowCheck = -1
      colCheck = 0
      break;
    case "ArrowDown":
      rowStart = board.length-1
      colStart = board.length-1
      rowCheck = 0
      colCheck = -1
      break;
  }

  // combines squares
  for (var i = 0; i < board.length; i++) {
    // console.log('running iteration',i)
    row1 = rowStart + i*rowCheck
    row2 = rowStart + i*rowCheck + colCheck
    col1 = colStart + i*colCheck
    col2 = colStart + i*colCheck + rowCheck

    while (row2 >= 0 && row2 < board.length && col2 >= 0 && col2 < board.length) {
      if (board[row1][col1] === null) {
        row1+=colCheck
        col1+=rowCheck
        row2+=colCheck
        col2+=rowCheck
      } else if (board[row2][col2] === null) {
        row2+=colCheck
        col2+=rowCheck
      } else if (board[row1][col1] === board[row2][col2]) {
        score += board[row1][col1]*2
        board[row1][col1] *= 2
        board[row2][col2] = null
        row1+=2*colCheck
        col1+=2*rowCheck
        row2+=2*colCheck
        col2+=2*rowCheck
      } else {
        row1+=colCheck
        col1+=rowCheck
        row2+=colCheck
        col2+=rowCheck
      }
    }
  }
  // console.log(board)

  // moves all squares to the inputted side
  console.log('started slider')
  for (var i = 0; i < board.length; i++) {
    row = rowStart + i*rowCheck + colCheck
    col = colStart + i*colCheck + rowCheck

    while (row >= 0 && row < board.length && col >= 0 && col < board.length) {
      if (board[row][col] === null) {
        row+=colCheck
        col+=rowCheck
      } else {
        moveRow = row
        moveCol = col
        emptyRow = row - colCheck
        emptyCol = col - rowCheck

        while (emptyRow >= 0 && emptyRow < board.length && emptyCol >= 0 && emptyCol < board.length) {
          if (board[emptyRow][emptyCol] === null) {
            board[emptyRow][emptyCol] = board[moveRow][moveCol]
            board[moveRow][moveCol] = null
            moveRow = emptyRow
            moveCol = emptyCol
          }
          emptyRow -= colCheck
          emptyCol -= rowCheck
        }
        row+=colCheck
        col+=rowCheck
      }
    }
  }
  // console.log(board)
  console.log('finished slider')
  return {board:board, score:score}
}

function arrCopy(arr) {
  newArr = []
  for (var i = 0; i < arr.length; i++) {
    newArr.push([])
    for (var j = 0; j < arr.length; j++) {
      newArr[i][j] = arr[i][j]
    }
  }
  return newArr
}

function arrEqual(arr1, arr2){
  if (arr1.length !== arr2.length) {
    return false
  }
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {
      return false
    }
    for (var j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false
      }
    }
  }
  return true
}

function generateRandom(board) {
  console.log('running generateRandom')
  var num, row, col, threshold
  threshold = .13

  if (Math.random() > threshold) {
    num = 2
  } else {
    num = 4
  }

  do {
    row = Math.floor(Math.random()*board.length)
    col = Math.floor(Math.random()*board.length)
  } while (board[row][col] !== null)
  board[row][col] = num

  return board
}

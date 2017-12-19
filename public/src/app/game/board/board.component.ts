import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from './../../data.service'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board = []
  gameOver = false



  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit() {
    console.log('running on init')
    this._dataService.board.subscribe(
      (board) => {
        this.board = board
      }
    )
    this._dataService.getBoard(
      (board) => {
        console.log('started board')
       },
      (error) => { console.log('there was an error:', error) }
    )
    this._dataService.gameOver.subscribe(
      (gameOver) => { this.gameOver = gameOver }
    )
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent){
    console.log('event',event.key)
    if (!this.gameOver){
      console.log('got past gameOver')
      if (event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp") {
        console.log('got past arrows')
        if (this.canMove(this.board)){
          console.log('got past canMove')
          this._dataService.getMove(event.key,
            (response) => {
              console.log('finished get move')
              if (response.newHigh) {
                this._dataService.getRecords(() => {
                  console.log('getting records due to new high')
                })
              }
            },
            (error) => { console.log('there was an error', error) }
          )
        }
      }
    }
  }

  canMove(board){
    console.log('running canMove')
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

  colors(num){
    let color: string
    switch (num) {
      case null: {
        color = 'white'
        break; }
      case 2: {
        color = 'lightgrey'
        break; }
      case 4: {
        color = 'tan'
        break; }
      case 8: {
        color = '#f2b179'
        break; }
      case 16: {
        color = 'orange'
        break; }
      case 32: {
        color = '#a92f2f'
        break; }
      case 64: {
        color = 'red'
        break; }
      case 128: {
        color = '#f8cb03'
        break; }
      case 256: {
        color = 'yellow'
        break; }
      case 512: {
        color = '#fff77d'
        break; }
      case 1024: {
        color = 'lightblue'
        break; }
      case 2048: {
        color = 'blue'
        break; }
      case 4096: {
        color = '#2fe72f'
        break; }
      case 8192: {
        color = '#860e86'
        break; }
      case 16384: {
        color = 'pink'
        break; }
    }
    return color
  }

}

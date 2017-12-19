import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { BehaviorSubject } from 'Rxjs/BehaviorSubject'

@Injectable()
export class DataService {
  board: BehaviorSubject<any[]> = new BehaviorSubject([[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])
  score: BehaviorSubject<number> = new BehaviorSubject(0)
  moves: BehaviorSubject<number> = new BehaviorSubject(0)
  highScore: BehaviorSubject<object> = new BehaviorSubject({})
  lowScore: BehaviorSubject<object> = new BehaviorSubject({})
  newHigh: BehaviorSubject<boolean> = new BehaviorSubject(false)
  newLow: BehaviorSubject<boolean> = new BehaviorSubject(false)
  gameOver: BehaviorSubject<boolean> = new BehaviorSubject(false)


  constructor(
    private _http: Http
  ) { }

  updateScore(newScore: number): void {
    this.score.next(newScore)
  }
  updateMoves(newMoves: number): void {
    this.moves.next(newMoves)
  }
  updateBoard(newBoard: number[]): void {
    this.board.next(newBoard)
  }
  updateHighScore(newHighScore: object): void {
    this.highScore.next(newHighScore)
  }
  updateLowScore(newLowScore: object): void {
    this.lowScore.next(newLowScore)
  }
  updateNewHigh(newHigh: boolean): void {
    this.newHigh.next(newHigh)
  }
  updateNewLow(newLow: boolean): void {
    this.newLow.next(newLow)
  }
  updateGameOver(gameOver: boolean): void {
    this.gameOver.next(gameOver)
  }

  getBoard(callback, errorback){
    console.log('running getBoard')
    this._http.get('/games').subscribe(
      (res) => {
        this.updateScore(res.json().score)
        this.updateMoves(res.json().moves)
        this.updateBoard(res.json().board)
        callback(res.json())
      },
      (err) => {errorback(err)}
    )
  }

  getRecords(callback){
    console.log('running getRecords')
    this._http.get('/scores').subscribe(
      (res) => {
        callback(res.json())
        console.log(res.json().highScore)
        console.log(res.json().lowScore)
        this.updateHighScore(res.json().highScore)
        this.updateLowScore(res.json().lowScore)
      }
    )
  }

  getMove(key, callback, errorback){
    console.log('running getMove')
    this._http.get(`/games/move/${key}`).subscribe(
      (res) => {
        callback(res.json())
        this.updateScore(res.json().score)
        this.updateMoves(res.json().moves)
        this.updateBoard(res.json().board)
        this.updateNewHigh(res.json().newHigh)
        this.updateNewLow(res.json().newLow)
        this.updateGameOver(res.json().gameOver)
      },
      (err) => {errorback(err)}
    )
  }

  reset(callback, errorback) {
    console.log('running reset')
    this._http.get('/games/reset').subscribe(
      (res) => {
        this.updateBoard(res.json().board)
        this.updateScore(res.json().score)
        this.updateMoves(res.json().moves)
        this.updateNewLow(false)
        this.updateNewHigh(false)
      },
      (err) => {errorback(err)}
    )
  }

}

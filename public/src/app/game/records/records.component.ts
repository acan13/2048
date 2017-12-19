import { Component, OnInit } from '@angular/core';
import { DataService } from './../../data.service'
import { User } from './../../user'
import { Http } from '@angular/http'

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  highScore = {}
  lowScore = {}
  timedHigh = 0
  newHigh = false
  newLow = false
  gameOver = false
  user: User

  constructor(
    private _dataService: DataService,
    private _http: Http
  ) { }

  ngOnInit() {
    this.user = new User()

    this._dataService.highScore.subscribe(
      (highScore) => { this.highScore = highScore }
    )
    this._dataService.lowScore.subscribe(
      (lowScore) => { this.lowScore = lowScore }
    )
    this._dataService.newHigh.subscribe(
      (newHigh) => { this.newHigh = newHigh }
    )
    this._dataService.newLow.subscribe(
      (newLow) => { this.newLow = newLow }
    )
    this._dataService.gameOver.subscribe(
      (gameOver) => { this.gameOver = gameOver }
    )
    this._dataService.getRecords(
      (response) => { console.log('got records') }
    )
  }

  newHighSubmit(){
    this.user.records = "high"
    this._http.post('/scores', this.user).subscribe(
      (res) => {
        console.log('updated high score')
        console.log('high',res.json().highscore)
        this._dataService.updateNewHigh(false)
        this._dataService.updateHighScore(res.json().highScore)
      },
      (err) => { console.log('error updating high score',err) }
    )
  }

  newLowSubmit(){
    this.user.records = "low"
    this._http.post('/scores', this.user).subscribe(
      (res) => {
        console.log('updated low score')
        console.log('low',res.json().lowScore)
        this._dataService.updateNewLow(false)
        this._dataService.updateLowScore(res.json().lowScore)
      },
      (err) => {
        console.log('error updating low score',err)
        this._dataService.getRecords(() => {
          console.log('got records')
        })
      }
    )
  }

  newBothSubmit(){
    this.user.records = "both"
    this._http.post('/scores', this.user).subscribe(
      (res) => {
        console.log('updated both scores')
        console.log('low:',res.json().lowScore)
        console.log('high:',res.json().highScore)
        this._dataService.updateNewLow(false)
        this._dataService.updateNewHigh(false)
        this._dataService.updateHighScore(res.json().lowScore)
        this._dataService.updateLowScore(res.json().highScore)
       },
      (err) => { console.log('error updating both scores',err) }
    )
  }

}

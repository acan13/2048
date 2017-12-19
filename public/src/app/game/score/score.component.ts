import { Component, OnInit } from '@angular/core';
import { DataService } from './../../data.service'


@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  score: number = 0
  moves: number = 0
  newHigh = false
  newLow = false

  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit() {
    this._dataService.score.subscribe(
      (score) => { this.score = score }
    )
    this._dataService.moves.subscribe(
      (moves) => { this.moves = moves }
    )
    this._dataService.newHigh.subscribe(
      (newHigh) => { this.newHigh = newHigh }
    )
    this._dataService.newLow.subscribe(
      (newLow) => { this.newLow = newLow }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { DataService } from './../../data.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit() {
  }

  restart(){
    this._dataService.reset(
      (success) => {
        console.log('reset')
        this._dataService.updateNewLow(false)
        this._dataService.updateNewHigh(false)
      },
      (error) => {console.log('error',error)}
    )
    this._dataService.getRecords(() => {
      console.log('finished get records')
    })
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { RecordsComponent } from './game/records/records.component';
import { MenuComponent } from './game/menu/menu.component';
import { ScoreComponent } from './game/score/score.component';
import { BoardComponent } from './game/board/board.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { DataService } from './data.service'


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    RecordsComponent,
    MenuComponent,
    ScoreComponent,
    BoardComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

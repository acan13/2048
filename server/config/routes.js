path = require('path')
var games = require('../controllers/games_controller.js')
var sessions = require('../controllers/sessions_controller.js')
var scores = require('../controllers/scores_controller.js')
// add required models here

module.exports = (app) => {
  // add routes here
app.get('/games/create',games.create),
app.get('/games',games.show),
app.get('/games/move/:key',games.move),
app.get('/games/destroy',games.destroy),
app.get('/games/reset',games.reset),
app.get('/sessions/create',sessions.create),
app.get('/sessions/destroy',sessions.destroy),
app.post('/scores',scores.create),
app.get('/scores/show',scores.show),
app.get('/scores/destroy',scores.destroy),
app.get('/scores',scores.index),


  app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/index.html"))
  })
}

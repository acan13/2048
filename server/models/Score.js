var mongoose = require('mongoose')

var ScoreSchema = new mongoose.Schema({
  //schema stuff
  scoreName: {type:String, required:true, unique:true},
  score: {type:Number, required:true},
  moves: {type:Number, required:true},
  userName: {type:String},
  board: {type:Object}
}, {timestamps:true})

mongoose.model("Score",ScoreSchema)
module.exports = mongoose.model("Score")

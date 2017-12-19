var mongoose = require('mongoose')

var GameSchema = new mongoose.Schema({
  //schema stuff
}, {timestamps:true})

mongoose.model("Game",GameSchema)
module.exports = mongoose.model("Game")

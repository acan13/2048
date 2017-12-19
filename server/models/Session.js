var mongoose = require('mongoose')

var SessionSchema = new mongoose.Schema({
  //schema stuff
}, {timestamps:true})

mongoose.model("Session",SessionSchema)
module.exports = mongoose.model("Session")

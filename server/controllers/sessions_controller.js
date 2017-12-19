var Session = require('../models/Session.js')
var session = require('express-session')

module.exports = {
  create: (req,res) => {
    return res.render('sessions/create')
  },
  destroy: (req,res) => {
    return res.render('sessions/destroy')
  },
  index: (req,res) => {
    return res.render('index')
  }
}

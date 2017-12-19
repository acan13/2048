var Score = require('../models/Score.js')
var session = require('express-session')

module.exports = {
  create: (req,res) => {
    console.log('running score create method')
    console.log(req.body)
    if (req.body.records === "low") {
      console.log('records was low')
      Score.findOne({scoreName:"lowScore"}, (err, score) => {
        if (err) {
          console.log('error finding low score')
          return res.json(err)
        } else {
          score.userName = req.body.name
          score.save((error) => {
            if (error) {
              console.log('error saving low score',error)
            }
          })
          return res.json({newLow:false, lowScore:score})
        }
      })
    } else if (req.body.records === "high") {
      console.log('records was high')
      Score.findOne({scoreName:"highScore"}, (err, score) => {
        if (err) {
          console.log('error finding high score')
          return res.json(err)
        } else {
          score.userName = req.body.name
          score.save((error) => {
            if (error) {
              console.log('error saving high score',error)
            }
          })
          return res.json({newHigh:false, highScore:score})
        }
      })
    } else if (req.body.records === "both") {
      console.log('records was both')
      Score.findOne({scoreName:"lowScore"}, (err, score) => {
        if (err) {
          console.log('error finding low score')
          return res.json(err)
        } else {
          score.userName = req.body.name
          score.save((error) => {
            if (error) {
              console.log('error saving low name in both')
            }
          })
          Score.findOne({scoreName:"highScore"}, (err, highScore) => {
            if (err) {
              console.log('error finding high score')
              return res.json(err)
            } else {
              highScore.userName = req.body.name
              highScore.save((error) => {
                if (error) {
                  console.log('error saving high name in both')
                }
              })
              return res.json({newLow:false, lowScore:score, newHigh:false, highScore:highScore})
            }
          })
        }
      })
    } else {
      return res.json({})
    }
  },
  show: (req,res) => {
    return res.render('scores/show')
  },
  destroy: (req,res) => {
    Score.remove({}, (err) => {
      if (err) {
        console.log('error removing records',err)
        return res.json(err)
      }
    })
    return res.json({message:"all records destroyed"})
  },
  index: (req,res) => {
    let newHighScore = new Score({scoreName:"highScore", score:0, moves:0, userName:"anonymous"})
    Score.findOne({scoreName:"highScore"}, (err, score) => {
      if (err) {
        console.log('error finding high score',err)
        return res.json(err)
      } else if (score) {
        // console.log('found high score',score)
        highScore = score
      } else {
        newHighScore.save((error) => {
          console.log('error saving new high score')
          console.log(error)
        })
        highScore = newHighScore
      }


      let newLowScore = new Score({scoreName:"lowScore", score:999999, moves:999999, userName:"anonymous"})
      Score.findOne({scoreName:"lowScore"}, (err, score) => {
        if (err) {
          console.log('error finding low score',err)
          return res.json(err)
        } else if (score) {
          // console.log('found low score',score)
          lowScore = score
        } else {
          newLowScore.save((error) => {
            console.log('error saving new low score')
            console.log(error)
          })
          lowScore = newLowScore
        }
        return res.json({
          highScore:highScore,
          lowScore:lowScore
        })
      })
    })
  }
}

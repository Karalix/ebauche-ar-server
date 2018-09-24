
const express = require('express')
const fetch = require('node-fetch')
let fs = require('fs')
const exec = require('child_process').exec
const app = express()

const webstrateURL = 'webstrates.cs.au.dk/'

app.get('/:id', function (req, res) {
  let svgString = null
  let fetchReq = `https://web:strate@${webstrateURL}/${req.params.id}/?raw`
  console.log(fetchReq)
  try {
    fetch(fetchReq)
      .then(res => res.text())
      .then(async body => {
        svgString = body.match(/.*(<svg.+<\/svg>).*/)
        if(svgString){
          let cleaned = svgString[1].replace('xmlns:xlink ', ' ')
          fs.writeFileSync('tmpSvg.svg', cleaned);
          exec('convert ./tmpSvg.svg ./tmpSvg.png', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
              return
            }
            res.sendFile(`${__dirname}/tmpSvg.png`)
          })
        }
      })
  } catch (error) {
    throw error
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

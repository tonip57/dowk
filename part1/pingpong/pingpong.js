const http = require("http")
const fs = require('fs')
require('dotenv').config()

const host = '0.0.0.0'
const PORT = process.env.PORT
let count = 0

const requestListener = function (req, res) {
    if (req.method === 'POST') {
      console.log('POST')
      res.end(`ok`)
    } else if (req.method === 'GET') {
      console.log('GET')
      count = count + 1
      fs.writeFile('/usr/src/app/files/pongs.txt', String(count), err => {
        if (err) {
          console.error(err)
          return
        }
      })
      res.writeHead(200)
      res.end(`pong ${count}`)
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})

/* node pingpong.js */
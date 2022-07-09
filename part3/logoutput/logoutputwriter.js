const fs = require('fs')

/*const randomString = Math.random().toString(36).substring(2,7)*/

setInterval(function(){ 
  let timestamp = `${new Date().toISOString()}`
  fs.writeFile('/usr/src/app/files/file.txt', timestamp, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}, 5000)


/*
const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})

const requestListener = function (req, res) {
    if (req.method === 'POST') {
      console.log('POST')
      res.end(`ok`)
    } else if (req.method === 'GET') {
      console.log('GET')
      res.writeHead(200);
      res.end(`${new Date().toISOString()}: ${randomString}`)
    }
}*/
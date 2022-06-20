const fs = require('fs')
const http = require("http")
require('dotenv').config()

const host = '0.0.0.0'
const PORT = process.env.PORT
const randomString = Math.random().toString(36).substring(2,7)

const requestListener = function (req, res) {
    let pongdata

    try {
        pongdata = fs.readFileSync('/usr/src/app/files/pongs.txt', 'utf8')
    } catch (err) {
        console.error(err)
        pongdata = 'no pongdata'
    }

    try {
        const data = fs.readFileSync('/usr/src/app/files/file.txt', 'utf8')
        res.writeHead(200);
        res.end(`${data}: ${randomString}\nPing / Pongs: ${pongdata}`)
    } catch (err) {
        console.error(err)
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})
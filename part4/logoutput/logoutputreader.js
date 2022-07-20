const { default: axios } = require('axios')
const fs = require('fs')
const http = require("http")
require('dotenv').config()

const host = '0.0.0.0'
const PORT = 3301
const MESSAGE = process.env.MESSAGE
const randomString = Math.random().toString(36).substring(2,7)

const readTimestamp = () => {
    try {
        const data = fs.readFileSync('/usr/src/app/files/file.txt', 'utf8')
        return data
    } catch (err) {
        console.error(err)
    }
}

const requestListener = function (req, res) {

    if (req.method === 'POST') {
        console.log('POST')
        res.end(`ok`)
      } else if (req.method === 'GET') {
        if (req.url.includes('/healthz')) {
            console.log(String(req.url))
            axios.get('http://pingpong-svc:81/getPongs')
                .then(function (response) {
                console.log(response.data)
                res.writeHead(200)
                res.end()
            })
                .catch(function (error) {
                console.log(error)
            })
                res.writeHead(200)
                res.end()
        } else {
        axios.get('http://pingpong-svc:81/getPongs')
            .then(function (response) {
                console.log(response.data)
                res.writeHead(200)
                res.end(`${MESSAGE}\n${readTimestamp()}: ${randomString}\nPing / Pongs: ${response.data}`)
            })
            .catch(function (error) {
                console.log(error)
        })}
      }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})
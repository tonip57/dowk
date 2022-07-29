import http from "http"
const host = '0.0.0.0'
const PORT = 4000

const requestListener = function (req, res) {
    if (req.method === 'GET') {
        res.writeHead(200)
        res.write(process.env.WEBSITE)
        res.end()
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})
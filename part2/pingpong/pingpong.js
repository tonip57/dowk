const http = require("http")
const fs = require('fs')
require('dotenv').config()
const axios = require('axios').default

const { Pool } = require('pg')

const host = '0.0.0.0'
const PORT = process.env.PORT
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

const initPool = new Pool({
  host: "postgres-svc",
  user: "user",
  database: "db",
  password: POSTGRES_PASSWORD,
  port: 5432,
})

initPool.query(`CREATE TABLE IF NOT EXISTS "pongs" ("pongcount" INT); INSERT INTO pongs(pongcount)VALUES('0');`, (err, result) => {
  initPool.end()
})

const requestListener = function (req, res) {
  const pool = new Pool({
      host: "postgres-svc",
      user: "user",
      database: "db",
      password: POSTGRES_PASSWORD,
      port: 5432,
  })

    if (req.method === 'POST') {
      res.end(`ok`)
    } else if (req.method === 'GET') {


      if (req.url.includes('getPongs')) {
        pool.query(`SELECT * FROM pongs;`, (err, result) => {
          let pongs = (result.rows.length > 0) ? result.rows[0] : null
          let pongsInString = JSON.stringify(pongs["pongcount"])
          pool.end()
          res.writeHead(200)
          res.end(`${pongsInString}`)
        })


      } else if (!req.url.includes('getPongs') && !req.url.includes('/favicon.ico')) {
        pool.query(`SELECT * FROM pongs;`, (err, result) => {
          console.log(result)
          let pongs = (result.rows.length > 0) ? result.rows[0] : null
          let pongsInString = parseInt(JSON.stringify(pongs["pongcount"]))
          pool.query(`DELETE FROM pongs;`, (err, result) => {
            pool.query(`INSERT INTO pongs(pongcount)VALUES(${pongsInString + 1});`, (err, result) => {
              pool.end()
              res.writeHead(200)
              res.end(`Ping / Pongs: ${pongsInString + 1}`)
            })
          })
        })
      }
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})

/* node pingpong.js */
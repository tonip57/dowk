import http from "http"
import {} from 'dotenv/config'
import pkg from "pg"
import { connect, StringCodec } from "nats"


const { Pool } = pkg

const host = '0.0.0.0'
const PORT = 3301
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
const NATS_URL = process.env.NATS_URL

const nc = await connect({ servers: NATS_URL })
const sc = StringCodec()

/*
const initPool = new Pool({
    host: "localhost",
    user: "user",
    database: "db",
    password: "password",
    port: 8009,
})
*/

const requestListener = function (req, res) {
    
    /*
    const pool = new Pool({
        host: "localhost",
        user: "user",
        database: "db",
        password: "password",
        port: 8009,
    })
    */
    
    const pool = new Pool({
        host: "postgres-svc",
        user: POSTGRES_USER,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
        port: 5432,
    })
    

    if (req.method === 'POST') {
        console.log("POST")
        if (req.url.includes('/todos/')) {
            var todo = req.url.slice(7).replace(/%20/g, " ")
            if (todo.length <= 141) {
                console.log(`Adding new todo: ${todo}`)
                pool.query(`INSERT INTO todos(todo, done)VALUES('${todo}', 'false');`, (err, result) => {
                    nc.publish("message", sc.encode(`Todo created: ${todo}`))
                    pool.query(`SELECT * FROM todos;`, (err, result) => {
                        pool.end()
                        let todoList = []
                        result.rows.forEach(todo => 
                            todoList.push(`{"todo": "${todo["todo"]}", "done": ${todo["done"]}, "id": ${todo["id"]}}`)
                        )
                        res.writeHead(200, {'Content-Type': 'text/html'})
                        res.write(`{ "todoList": [ ${todoList} ] }`)
                        res.end()
                    })
                })
            } else {
                console.error(`Invalid todo length (${todo.length} characters)`)
                pool.query(`SELECT * FROM todos;`, (err, result) => {
                    pool.end()
                    let todoList = []
                    result.rows.forEach(todo => 
                        todoList.push(`{"todo": "${todo["todo"]}", "done": ${todo["done"]}, "id": ${todo["id"]}}`)
                    )
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.write(`{ "todoList": [ ${todoList} ] }`)
                    res.end()
                })
            }
        }
    } else if (req.method === 'GET' && !req.url.includes('favicon')) {
        console.log("GET")
        if (req.url.includes('/healthz')) {
            const initPool = new Pool({
                host: "postgres-svc",
                user: POSTGRES_USER,
                database: POSTGRES_DB,
                password: POSTGRES_PASSWORD,
                port: 5432,
            })
            console.log(String(req.url))

            try {
                initPool.query(`CREATE TABLE IF NOT EXISTS "todos" ("todo" VARCHAR(140), "id" SERIAL UNIQUE, "done" BOOLEAN);`, (err, result) => {
                    initPool.end()
                })
                res.writeHead(200)
                res.end()
            } catch (e) {
                console.log(e)
                res.writeHead(500)
                res.end()
            }
        }
    
        if (req.url.includes('/todos')) {
            pool.query(`SELECT * FROM todos;`, (err, result) => {
                pool.end()
                if (result === undefined || result.rowCount === 0) {
                    console.log("Empty table")
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end()
                } else {
                    let todoList = []
                    result.rows.forEach(todo => 
                        todoList.push(`{"todo": "${todo["todo"]}", "done": ${todo["done"]}, "id": ${todo["id"]}}`)
                    )
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.write(`{ "todoList": [ ${todoList} ] }`)
                    res.end()
                }
            })
        }
    } else if (req.method === 'PUT' && !req.url.includes('favicon')) {
        console.log("PUT")
        if (req.url.includes('/todos/')) {
            var id = req.url.slice(7).replace(/%20/g, " ")
                pool.query(`UPDATE todos SET done = 'true' WHERE id = ${parseInt(id)};`, (err, result) => {
                    pool.query(`SELECT * FROM todos WHERE id = ${parseInt(id)};`, (err, result) => {
                        nc.publish("message", sc.encode(`Todo done: ${result.rows[0]["todo"]}`))
                        pool.query(`SELECT * FROM todos;`, (err, result) => {
                            pool.end()
                            let todoList = []
                            result.rows.forEach(todo => 
                                todoList.push(`{"todo": "${todo["todo"]}", "done": ${todo["done"]}, "id": ${todo["id"]}}`)
                            )
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            res.write(`{ "todoList": [ ${todoList} ] }`)
                            res.end()
                        })
                    })
                })
        }
    } else {
        res.writeHead(200)
        res.end()
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})


/* node backend.js */

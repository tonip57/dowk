import http from "http"
import {} from 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg

const host = '0.0.0.0'
const PORT = process.env.PORT
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

/*
const initPool = new Pool({
    host: "localhost",
    user: "user",
    database: "db",
    password: "password",
    port: 8009,
})
*/

const initPool = new Pool({
    host: "postgres-svc",
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432,
})

  
initPool.query(`CREATE TABLE IF NOT EXISTS "todos" ("todo" VARCHAR(140)); INSERT INTO todos(todo)VALUES('EXAMPLE');`, (err, result) => {
    initPool.end()
})

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
        if (req.url.includes('/todos/')) {
            var todo = req.url.slice(7).replace(/%20/g, " ")
            if (todo.length <= 141) {
                console.log(`Adding new todo: ${todo}`)
                pool.query(`INSERT INTO todos(todo)VALUES('${todo}');`, (err, result) => {
                    pool.query(`SELECT * FROM todos;`, (err, result) => {
                        pool.end()
                        let todoList = []
                        result.rows.forEach(todo => 
                            todoList.push(`"${todo["todo"]}"`)
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
                        todoList.push(`"${todo["todo"]}"`)
                    )
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.write(`{ "todoList": [ ${todoList} ] }`)
                    res.end()
                })
            }
        }
    } else if (req.method === 'GET') {
        if (req.url.includes('/todos')) {
            pool.query(`SELECT * FROM todos;`, (err, result) => {
                pool.end()
                if (result === undefined || result.rowCount === 0) {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end()
                } else {
                    let todoList = []
                    result.rows.forEach(todo => 
                        todoList.push(`"${todo["todo"]}"`)
                    )
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.write(`{ "todoList": [ ${todoList} ] }`)
                    res.end()
                }
            })
        }
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})

/* node backend.js */
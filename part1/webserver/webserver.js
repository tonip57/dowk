import http from "http"
import fs from 'fs'
import {} from 'dotenv/config'
import imageToBase64 from 'image-to-base64'
import download from 'image-downloader'

const host = '0.0.0.0'
const PORT = process.env.PORT
const todoList = ['TODO 1', 'TODO 2']
const photoUrl = 'https://picsum.photos/1200'
const volumeUrl = '/usr/src/app/files/'
///const volumeUrl = 'C:/Users/tonip/kube/webserver/files/'

const getCurrentTimestamp = () => {
    const d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDate()
    const currentTimestamp = day + '.' + month + '.' + year
    return currentTimestamp
}

const checkTimestamp = () => {
    try {
        const timestampInFile = fs.readFileSync(volumeUrl + 'timestamp.txt', 'utf8')
        return timestampInFile
    } catch (err) {
        return null
    }
}

const saveTimestamp = () => {
    const currentTimestamp = getCurrentTimestamp()
    fs.writeFile(volumeUrl + 'timestamp.txt', currentTimestamp, err => {
    if (err) {
        console.error(err)
    }
    return
    })
}

const downloadNewPhoto = () => {
    try {
        download.image({url: photoUrl,dest: volumeUrl + 'image.jpg',})
        .then(({ filename }) => {
            console.log('Saved to', filename)
        })
        .catch((err) => console.error(err))
        saveTimestamp()
    } catch (err) {
        console.error(err)
    }
}

const checkIfPhotoValid = () => {
    if (checkTimestamp() === getCurrentTimestamp()) {
        return true
    } else {
        return false
    }
}

const returnTodos = () => {
    let htmlstring = ''
    todoList.forEach(item => (htmlstring = htmlstring + `<li>${item}</li>`))
    return (htmlstring)
}

const requestListener = function (req, res) {
    if (req.method === 'POST') {
        console.log('POST')
        res.end(`ok`)
    } else if (req.method === 'GET') {
        if (checkIfPhotoValid() === false || !fs.existsSync(volumeUrl + 'image.jpg')) {
            console.log("Downloading new photo")
            downloadNewPhoto()
        } else {
            console.log("Using old photo")
        }
        
        try {
            imageToBase64(volumeUrl + "image.jpg")
            .then(
                (response) => {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.write(`<img src="data:image/jpeg;base64,${response}" widht="200px" height="200px"><input maxlength="140"></input><button type="button">Create TODO</button><ul>${returnTodos()}</ul>`)
                    res.end()
                }
            )
        } catch (err) {
            console.error(err)
        }
    }
}

const server = http.createServer(requestListener)
server.listen(PORT, host, () => {
    console.log(`Server started in port ${PORT}`)
})

/* node webserver.js */
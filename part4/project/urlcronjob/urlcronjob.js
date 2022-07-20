import axios from 'axios'

axios.get("https://en.wikipedia.org/wiki/Special:Random")
    .then(function (response) {
        console.log(response.request.res.responseUrl)
        axios.post('http://webserver-svc:2345/postUrl/' + String(response.request.res.responseUrl))
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
            console.log(error)
        }
    )
    })
    .catch(function (error) {
        console.log(error)
    })
const express = require('express')
const app = express()
const path = require ('path')

let port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/index2.html'))
})

app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/login.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/flare', function (req, res) {
    res.sendFile(path.join(__dirname+'/flare.json'))
})

app.listen(port, function() {
    console.log("Listening on prt 3000")
})

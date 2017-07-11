const express = require('express')
const app = express()
const path = require ('path')


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/index2.html'))
})

app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/test.html'))
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/login.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/flare', function (req, res) {
    res.sendFile(path.join(__dirname+'/flare.json'))
})

app.listen(3000, function() {
    console.log("Listening on prt 3000")
})

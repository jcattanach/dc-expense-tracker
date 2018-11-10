 const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const models = require('./models')
const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
app.engine('mustache', mustacheExpress())
app.set("views", "./views")
app.set("view engine", "mustache")

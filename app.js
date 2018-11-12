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

app.get('/login',function(req,res){
    res.render('login')
})

app.get('/register',function(req,res){
    res.render('register')
})
 
app.listen(3000,function(){
    console.log('Server is running')
})

app.get('/',function(req,res){
    models.transaction.findAll().then(function(transactions){
        res.render('index',{transactions: transactions})
    })
})
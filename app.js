const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const models = require('./models')
const functions = require('./functions')
const app = express()
const session = require('express-session')
const bcrypt = require('bcrypt')

app.use(session({
  secret: '1a2s3d',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
app.engine('mustache', mustacheExpress())
app.set("views", "./views")
app.set("view engine", "mustache")

app.get('/',function(req,res){
    res.render('login')
  })

app.post('/login', function(req,res){
  let username = req.body.loginUsername
  let password = req.body.loginPassword

  functions.user.getUserByUsername(username)
  .then(function(userInfo){
    if(userInfo == null){
      res.render('login',{message : 'You username or password is incorrect'})
    } 
    else {
        bcrypt.compare(password, userInfo.password, function(err, result) {
            if(result == true){
                console.log('login succesful')
                req.session.userid = userInfo.id
                res.redirect('/user-index')
            }else{
                res.render('login',{message : 'You username or password is incorrect'})
            }
        })
    }})
})

app.get('/register',function(req,res){
    res.render('register')
})

app.post('/register', function(req,res){
    let username = req.body.registerUsername
    let password = req.body.registerPassword
    let confirmPassword = req.body.confirmPassword
    let email = req.body.registerEmail

    if(registerPassword == confirmPassword){
        functions.user.addNewUser(username, password, email)
        .then(function(){
            res.redirect('/')
        })
    }
    else{
        res.render('register',{ message : 'Your passwords do not match.'})
    }
})


app.get('/user-index',function(req,res){
    let userid = req.session.userid
    if( userid == null){
        res.redirect('/')
    }else {
        functions.transaction.getAllUserTransactions(userid).then(function(transactions){
            res.render('index',{transactions: transactions})
        })
    }
})


//fetch a particular category
app.post('/filter-transactions',function(req,res){
  let userid = req.session.userid
  let category = req.body.category
  let timeFilter = req.body.timeFilter
  functions.transaction.filterByTimeAndCategory(userid, category, timeFilter)
  .then(function(results){
        res.render('index', {transactions: results})
  })
  .catch(function(error){

  })
})

app.get('/user-settings',function(req,res){
  res.render('settings')
})

app.post('/budget',function(req,res){
  let category = req.body.category
  let amount = req.body.amount

  functions.budget.addNewUserBudget(req.session.userid, category, amount)
  .then(function(){
      res.redirect('/index')
  })
  .catch(function(error){
      console.log(error)
  })
})

app.post('/new-transaction', function(req, res){
    let userid = req.session.userid
    let name = req.body.name
    let amount = req.body.amount
    let category = req.body.category
    let description = req.body.description

    functions.transaction.addNewTransaction(userid, name, amount, category, description)
    .then(function(){
        res.redirect('/user-index')
    })
    .catch(function(error){
        console.log(error)
    })
})

app.post('/delete-transaction', function(req, res){
    let transactionid = req.body.id
    functions.transaction.deleteTransaction(transactionid)
    .then(function(){
        res.redirect('/user-index')
    })
    .catch(function(error){
        console.log(error)
    })
})

app.post('/update-transaction', function(req, res){
    // functions.transaction.getByTransactionId(req.body.id)
    // .then(function(transaction){
    //     transaction.updateAttributes{

    //     }
    // })
    console.log("work in progress")
})

app.get('/logout', (req,res) =>{
    req.session.destroy(function(err){
    })
    res.redirect('/')
  })

app.listen(3000,function(){
    console.log('Server is running')
})

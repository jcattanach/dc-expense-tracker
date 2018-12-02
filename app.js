const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const models = require('./models')
const functions = require('./functions')
const app = express()
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 10

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


app.get('/register',function(req,res){
  res.render('register')
})

app.get('/',function(req,res){
    res.render('login')
  })

app.post('/login', function(req, res) {

  let username = req.body.loginUsername
  let password = req.body.loginPassword

  if (username == '') {
    res.render('login', {message: 'You username or password is incorrect'})
  } else {

    functions.user.getUserByUsername(username).then(function(userInfo) {
      if (userInfo == null) {
        res.render('login', {message: 'You username or password is incorrect'})
      } else {
        bcrypt.compare(password, userInfo.password, function(err, result) {
          if (result == true) {
            console.log('login succesful')
            req.session.userid = userInfo.id
            req.session.username = userInfo.username
            res.redirect('/user-index')
          } else {
            res.render('login', {message: 'You username or password is incorrect'})
          }
        })
      }
    })

  }
})


app.post('/register', function(req,res){
    let username = req.body.registerUsername
    let password = req.body.registerPassword
    let confirmPassword = req.body.confirmPassword
    let email = req.body.registerEmail
    // let errorMessage = null
    let allowRegister = false

    functions.user.usernameEmailTaken(username, email)
    .then(function(results){
        if(!results.usernameTaken && !results.emailTaken){
            if(password == confirmPassword){
                allowRegister = true
            }
            else{
                errorMessage = "Passwords don't match."
            }
        }
        else if(results.usernameTaken && !results.emailTaken){
            errorMessage = 'Username already in use.'
        }
        else if(results.emailTaken && !results.emailTaken){
            errorMessage = 'Email already in use.'
        }
        else {

            errorMessage = "Username and email already in use"
        }
    })
    .then(function(){
        if(allowRegister){
            functions.user.addNewUser(username, password, email)
            .then(function(){
                res.redirect('/')
            })
        }
        else {
            res.render('register',{message: errorMessage})
        }
    })
    .catch(function(error){
        console.log(error)
    })
})

app.get('/user-index',function(req,res){
    let userid = req.session.userid
    if( userid == null){
        res.redirect('/')
    }else {
        functions.transaction.getAllUserTransactions(userid).then(function(transactions){
            res.render('index',{transactions: transactions, username:req.session.username})
        })
    }
})

app.post('/filter-transactions',function(req,res){
    let userid = req.session.userid
    let category = req.body.category
    let timeFilter = req.body.timeFilter
    let categories = null

    functions.transaction.filterByTimeAndCategory(userid, category, timeFilter)
    .then(function(results){
        categories = results
        weekFilter(category, userid)
    })
    .catch(function(error){
        console.log(error)
    })
    function weekFilter(category, userid){
        functions.transaction.filterByTimeAndCategory(userid, category, 'week')
        .then(function(newResult){
            getOneBudget(categories, newResult)
        })}
    function getOneBudget(categories, newResult){
        functions.budget.getUserBudgetByCategory(userid, category).then(function(budget){
            let budgetUpdate = ''

        if(categories != null && budget != null){
            let sum = 0
            for(let i = 0; i < newResult.length; i++){
            sum += newResult[i].amount
            }
            let userBudget = budget.amount
            let budgetRemaining = userBudget - sum
            budgetUpdate = `Your weekly budget is $${userBudget}. You have $${budgetRemaining} remaining.`
            let overBudget = Math.abs(budgetRemaining)
            overBudgetUpdate = `Your weekly budget is $${userBudget}. You are over budget by $${overBudget}.`
            let message = ''

            if(budgetRemaining <= 25 && budgetRemaining > 0){
                message = 'You have $25 or less remaining in your budget for this category'
                res.render('index',{message:message, budgetUpdate:budgetUpdate, transactions:categories, username:req.session.username})
            } else if( budgetRemaining == 0){
                message = 'You have $0 remaining in your budget for this category'
                res.render('index',{message:message, budgetUpdate:budgetUpdate, transactions:categories, username:req.session.username})
            } else if( budgetRemaining < 0){
                message = 'You are over your limit for this category'
                res.render('index',{message:message, budgetUpdate:overBudgetUpdate, transactions:categories, username:req.session.username})
            } else if(budgetRemaining > 25) {
                res.render('index',{budgetUpdate:budgetUpdate, transactions:categories, username:req.session.username})
            }
        }
        else if(categories != null){
            res.render('index', {transactions:categories, username:req.session.username})
        }
        else {
            res.render('index', {budgetUpdate: "No transactions to display",username:req.session.username})
        }
    })
  }
})

app.get('/user-settings',function(req,res){
    functions.user.getUserById(req.session.userid)
    .then(function(user){
        res.render('account-info', {user: user, username:req.session.username})
    })
    .catch(function(error){
        console.log(error)
    })
})

app.get('/user-budgets',function(req,res){
    functions.budget.getAllUserBudgets(req.session.userid)
    .then(function(budgets){
        console.log(budgets)
        res.render('budgets', {budgets: budgets, username:req.session.username})
    })
    .catch(function(error){
        console.log(error)
    })
})

app.post('/new-budget', function(req, res){
    let userid = req.session.userid
    let category = req.body.category
    let amount = req.body.amount
    let budgetMessage = null

    functions.budget.budgetExists(userid, category)
    .then(function(exists){
        if(exists){
            budgetMessage = "A budget for this category already exists."
        }
        else {
            return functions.budget.addNewUserBudget(userid, category, amount)
        }
    })
    .then(function(){
        functions.budget.getAllUserBudgets(req.session.userid)
        .then(function(budgets){
            res.render('budgets', {message: budgetMessage, budgets: budgets, username:req.session.username})
        })
        .catch(function(error){
            console.log(error)
        })
    })
    .catch(function(error){
        console.log(error)
    })
})

app.post('/update-budget',function(req,res){
  let category = req.body.category
  let userid = req.session.userid
  let amount = req.body.amount
  console.log(amount)

  functions.budget.updateBudget(userid, category, amount)
  .then(function(){
      res.redirect('/user-budgets')
  })
  .catch(function(error){
      console.log(error)
  })
})

app.post('/delete-budget', function(req,res){
    let id = req.body.budgetid
    functions.budget.deleteBudgetById(id)
    .then(function(){
        res.redirect('/user-budgets')
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

app.post('/delete-account', function(req,res){
  let userid = req.session.userid
  functions.transaction.deleteTransactionByUserID(userid).then(function(){
    functions.budget.deleteBudgetByUserID(userid)
  }).then(function(){
    functions.user.deleteUserByUserID(userid)
  }).then(function(){
    req.session.destroy(function(err){
    res.redirect('/logout')
    })
  })
})

app.get('/delete-account', function(req,res){
  res.render('delete-account', {username:req.session.username})
})

app.post('/update-password', function(req,res){
  let newPassword = req.body.newPassword
  let confirmPassword = req.body.confirmPassword
  let oldPassword = req.body.oldPassword

  if(newPassword == confirmPassword){
  functions.user.getUserById(req.session.userid)
  .then(function(userInfo){
    let dbPassword = userInfo.password
    bcrypt.compare(oldPassword, dbPassword, function(err, result) {
        if(result == true){
            res.render('update-password',{message : 'Password updated', username:req.session.username})
            bcrypt.genSalt(saltRounds, function(err, salt){
                bcrypt.hash(newPassword, salt, function(err, hash){
                functions.user.updateUserPassword(req.session.userid, hash)
              })
            })
        }else{
            res.render('update-password',{message : 'Old password is incorrect', username:req.session.username})
        }
    })
  })} else {
    let message = 'Your new passwords do not match'
    res.render('update-password',{ message:message, username:req.session.username})
  }
})

app.get('/update-password', function(req,res){
  res.render('update-password', {username:req.session.username})
})

app.listen(3000,function(){
    console.log('Server is running')
})

// test comit

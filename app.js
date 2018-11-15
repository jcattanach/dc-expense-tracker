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
                req.session.username = userInfo.username
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

    if(password == confirmPassword){
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
            res.render('index',{transactions: transactions, username:req.session.username})
        })
    }
})

//fetch a particular category
app.post('/filter-transactions',function(req,res){
  let userid = req.session.userid
  let category = req.body.category
  let timeFilter = req.body.timeFilter

  if (category== "All"){
    res.redirect('/user-index')
  }else{functions.transaction.filterByTimeAndCategory(userid, category, timeFilter)
    .then(function(results){
          categories = results
          // getOneBudget(categories)
          weekFilter(category, userid)
    })
    .catch(function(error){

    })}

  function weekFilter(category, userid){
    functions.transaction.filterByTimeAndCategory(userid, category, 'week')
    .then(function(newResult){
      getOneBudget(categories, newResult)
    })}
  function getOneBudget(categories, newResult){

    models.budget.findOne({
      where:{
          category: category,
          userid: req.session.userid
      }
    }).then(function(budget){

      let budgetUpdate = ''

      if(categories && budget){
        let sum = 0
      for(let i = 0; i < newResult.length; i++){
        sum += newResult[i].amount
      }

      let userBudget = budget.amount
      let budgetRemaining = userBudget - sum
      budgetUpdate = `You weekly budget is $${userBudget}. You have $${budgetRemaining} remaining.`
      let message = ''
      if(budgetRemaining <= 25 && budgetRemaining > 0){
        let message = 'You have $25 or less remaining in your budget for this category'
        res.render('index',{message:message, budgetUpdate:budgetUpdate, transactions:categories})
      } else if( budgetRemaining == 0){
        let message = 'You have $0 remaining in your budget for this category'
        res.render('index',{message:message, budgetUpdate:budgetUpdate, transactions:categories})
      } else if( budgetRemaining < 0){
        let message = 'You are over your limit for this category'
        res.render('index',{message:message, budgetUpdate:budgetUpdate, transactions:categories})
      } else {
        res.render('index',{budgetUpdate:budgetUpdate, transactions:categories})
      }
    } else if (budget == null){
      res.render('index', {transactions:categories})
    }
    })
  }
})

app.get('/user-settings',function(req,res){
    functions.user.getUserById(req.session.userid)
    .then(function(user){
        res.render('account-info', {user: user})
    })
})

app.get('/user-budgets',function(req,res){
    functions.budget.getAllUserBudgets(req.session.userid)
    .then(function(budgets){
        console.log(budgets)
        res.render('budgets', {budgets: budgets})
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
      res.redirect('user-budgets')
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
  functions.user.deleteUserByUserID(userid)
  res.redirect('/logout')
})

app.get('/delete-account', function(req,res){
  res.render('delete-account')
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
            res.render('update-password',{message : 'Password updated'})
            bcrypt.genSalt(saltRounds, function(err, salt){
                bcrypt.hash(newPassword, salt, function(err, hash){
                functions.user.updateUserPassword(req.session.userid, hash)
              })
            })

        }else{
            res.render('update-password',{message : 'Old password is incorrect'})
        }
    })
  })} else {
    let message = 'Your new passwords do not match'
    res.render('update-password',{ message:message})
  }
})

app.get('/update-password', function(req,res){
  res.render('update-password')
})

app.listen(3000,function(){
    console.log('Server is running')
})

const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const models = require('./models')
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


app.post('/login', function(req,res){
  let loginUsername = req.body.loginUsername
  let loginPassword = req.body.loginPassword

  models.user.findOne({
    where : {
       username: loginUsername
    }
  }).then(function(userInfo){
    if(userInfo == null){
      res.render('login',{message : 'You username or password is incorrect'})
    } else {
    bcrypt.compare(loginPassword, userInfo.password, function(err, result) {
    if(result == true){
      console.log('login succesful')
      req.session.userid = userInfo.id
      res.redirect('/index')
    }else{
      res.render('login',{message : 'You username or password is incorrect'})
    }
  })
}})
})

app.post('/register', function(req,res){
  let registerUsername = req.body.registerUsername
  let registerPassword = req.body.registerPassword
  let confirmPassword = req.body.confirmPassword
  let registerEmail = req.body.registerEmail


  if(registerPassword == confirmPassword){

    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(registerPassword, salt, function(err, hash) {
          // Store hash in your password DB.
  let userInfo = models.user.build({
    username: registerUsername,
    password: hash,
    email: registerEmail
  })
  userInfo.save().then(function(){
    res.redirect('/')
  })
});
});

}else{
  res.render('register',{ message : 'Your passwords do not match.'})
}
})

app.get('/register',function(req,res){
    res.render('register')
})

app.listen(3000,function(){
    console.log('Server is running')
})

app.get('/index',function(req,res){
    if(req.session.userid == null){
        res.redirect('/')
      } else {

      models.transaction.findAll({
        where: {
          userid: req.session.userid
        }
      }).then(function(transactions){
          res.render('index',{transactions: transactions})
      })
    }
})


//fetch a particular category
app.post('/select-category',function(req,res){
    let ddViewBy = req.body.ddViewBy

    if (ddViewBy == "All") {
      res.redirect('index')
    }else {
        models.transaction.findAll({
            where:{
                category: ddViewBy,
                userid: req.session.userid
            }
        }).then(function(category){
            res.render('index',{category:category})
        })
      }
})

app.get('/budget',function(req,res){
  res.render('budget')
})

app.post('/budget',function(req,res){
  let foodInput = req.body.foodInput
  let educationInput = req.body.educationInput
  let housingInput = req.body.housingInput
  let transportInput = req.body.transportInput
  let personalInput = req.body.personalInput
  let billsInput = req.body.billsInput
  let otherInput = req.body.otherInput

  let newBudget = models.budget.build({
      food: foodInput,
      education: educationInput,
      housing: housingInput,
      transportation: transportInput,
      personal_expenses: personalInput,
      bills: billsInput,
      other: otherInput,
      userid: req.session.userid
  })
  newBudget.save().then(function(){
      res.redirect('/index')
  })
})



app.get('/logout', (req,res) =>{
  req.session.destroy(function(err){
  })
  res.redirect('/')
})

app.get('/',function(req,res){
  res.render('login')
})

app.post('/new-transaction', function(req, res){
    let transactionName = req.body.name
    let transactionAmount = req.body.amount
    let transactionCategory = req.body.category
    let transactionDescription = req.body.description

    let newTransaction = models.transaction.build({
        name: transactionName,
        amount: transactionAmount,
        category: transactionCategory,
        description: transactionDescription,
        userid: req.session.userid
    })
    newTransaction.save().then(function(){
        res.redirect('/index')
    })
})

app.post('/update-transaction', function(req,res){

})

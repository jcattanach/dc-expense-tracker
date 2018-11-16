const models = require('./../models')
const general = require('./general')

module.exports = {
    // returns array of budget objects
    // input: userid
    getAllUserBudgets : function(userid){
        return new Promise(function(resolve, reject){
            models.budget.findAll({
                where: {
                    userid: userid
                }
            })
            .then(function(results){
                resolve(general.getJSON(results))
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // returns one budget object based on category
    // input: userid, category
    getUserBudgetByCategory: function(userid, category){
        return new Promise(function(resolve, reject){
            models.budget.findOne({
                where: {
                    userid: userid,
                    category: category
                }
            }).then(function(result){
                resolve(general.getJSON(result))
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // inserts new budget into budget table
    // input: userid, category, amount
    addNewUserBudget: function(userid, category, amount){
        return new Promise(function(resolve, reject){
            let newBudget = models.budget.build({
                userid: userid,
                category: category,
                amount: amount
            })
            newBudget.save()
            .then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // removes transaction from budget table
    // input: category + userid
    deleteBudgetById: function(budgetid){
        return new Promise(function(resolve, reject){
            models.budget.destroy({
                where:{
                    id: budgetid
                }
            }).then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // updates budget amount
    updateBudget: function(userid, category, amount){
        return new Promise(function(resolve, reject){
            models.budget.update({
                    amount: amount
                   
                },
                {
                    where: {
                        userid: userid,
                        category: category
                    }
                }
            )
            .then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        }) 
    }
}

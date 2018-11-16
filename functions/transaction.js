const models = require('../models')
const general = require('./general')

module.exports = {
    // returgens array of transactions objects
    // input: userid
    getAllUserTransactions: function(userid){
        return new Promise(function(resolve, reject){
            models.transaction.findAll({
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
    getByTransactionId: function(transactionid){
        return new Promise(function(resolve, reject){
            models.transaction.findOne({
                where: {
                    id: transactionid
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
    // returns array of transactions filtered by time and category
    // input: userid, category, and time
    filterByTimeAndCategory: function(userid, category, timeFilter){
        let startDate = general.getStartDate(timeFilter)
        return new Promise(function(resolve, reject){
            models.transaction.findAll({
                where: {
                    userid: userid,
                    category: category,
                    createdAt:{
                        $gte: startDate
                    }
                }
            }).then(function(result){
                resolve(general.getJSON(result))
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // inserts new transaction to transaction table
    // input: name, amount ,catgeory, and description(optional)
    addNewTransaction: function(userid, name, amount, category, description){
        return new Promise(function(resolve, reject){
            let newTransaction = models.transaction.build({
                userid: userid,
                name: name,
                amount: amount,
                category: category,
                description: description
            })
            newTransaction.save()
            .then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // removes transaction from transaction table
    // input: transactionid
    deleteTransaction: function(transactionid){
        return new Promise(function(resolve, reject){
            models.transaction.destroy({
                where:{
                    id: transactionid
                }
            }).then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // removes transactions by userid from transaction table
    // input: userid
    deleteTransactionByUserID: function(userid){
        return new Promise(function(resolve, reject){
            models.transaction.destroy({
                where:{
                    userid: userid
                },
                cascade: true
            }).then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // updates transaction with input values
    updateTransaction: function(transactionid, name, amount, category, description){
        return new Promise(function(resolve, reject){
            models.transaction.update({
                name: name,
                amount: amount,
                category: category,
                description: description
            },
            {
                where: {
                    id: transactionid
                }
            })
            .then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    }
}

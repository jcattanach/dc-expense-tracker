 const models = require('../models')
const bcrypt = require('bcrypt')
const general = require('./general')
const saltRounds = 10

module.exports = {
    // returns array of all user objects
    getAllUsers : function(){
        return new Promise(function(resolve, reject){
            models.user.findAll()
            .then(function(results){
                resolve(general.getJSON(results))
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // returns one user object
    // input: userid
    getUserById: function(userId){
        return new Promise(function(resolve, reject){
            models.user.findOne({
                where: {
                    id: userId
                }
            }).then(function(result){
                resolve(general.getJSON(result))
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // returns one user object
    // input: username
    getUserByUsername: function(username){
        return new Promise(function(resolve, reject){
            models.user.findOne({
                where: {
                    username: username
                }
            }).then(function(result){
                resolve(general.getJSON(result))
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // inserts new user to user table
    // input: username, password, email
    addNewUser: function(username, password, email){
        return new Promise(function(resolve, reject){
            bcrypt.genSalt(saltRounds, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    let newUser = models.user.build({
                        username: username,
                        password: hash,
                        email: email
                    })
                    newUser.save()
                    .then(function(){
                        resolve(newUser.id)
                    })
                    .catch(function(error){
                        reject(error)
                    })
                })
            })
        })
    },
    // removes user from user table
    // input: userid
    deleteUserById: function(userid){
        return new Promise(function(resolve, reject){
            models.user.destroy({
                where:{
                    id: userid
                }
            }).then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    // removes user from user table
    // input: username
    deleteUserByUsername: function(username){
        return new Promise(function(resolve, reject){
            models.user.destroy({
                where:{
                    username: username
                }
            }).then(function(){
                resolve()
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    updateUser: function(userid, password = null, email = null){
        if (password == null)
        {
            password = models.user.findOne({
                where: {
                    id: userid
                }
            }).get({plain: true})
        }
        if (email == null){
            email = models.user.findOne({
                where: {
                    id: userid
                }
            }).get({plain: true})
        }
        return new Promise(function(resolve, reject){
            models.user.update({
                password: password,
                email: email
            },
            {
                where: {
                    id: userid
                }
            })
            .then(function(user){
                if(password != null){
                    user.updateAttributes({
                        password: password
                    })
                }
                if(email != null){
                    user.updateAttributes({
                        email: email
                    })
                }
            })
            .then(function(){
                resolve()
            })
            .catch(function(error){
                resject(error)
            })
        })
    },
    updateUserPassword: function(userid, password){
        return new Promise(function(resolve, reject){
            models.user.update({
                password: password
              },
              {
                  where :
                  {
                      id:userid
                  }
              }
            )
            .then(function(){
                resolve()
            })
            .catch(function(error){
                resject(error)
            })
        })
    },
}

/**
 * Auth service file
 * 
 * @package   backend/src/services
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var adminWebModel = require('../../models/web/admin-model')
var jwt = require('jsonwebtoken')
var message = require('../../constants/message')
var code = require('../../constants/code')
var key = require('../../config/key-config')
var timer  = require('../../constants/timer')

var webService = {
  getProfile: getProfile,
  updateProfile: updateProfile,
  getUserList: getUserList,
}


/**
 * Function that get profile data with uID
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function getProfile(uid) {
  return new Promise((resolve, reject) => {
    adminWebModel.getProfile(uid).then((data) => {
      if (data) {
        let userId = data.userID
        let token = jwt.sign({ uid: userId }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token,  profile: data} })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that update profile with uID
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function updateProfile(uid,data) {
  return new Promise((resolve, reject) => {
    adminWebModel.updateProfile(uid, data).then((data) => {
      if (data) {
        let token = jwt.sign({ uid: uid }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token} })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}

/**
 * Function that get User List with filter key
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function getUserList(uid, data) {
    return new Promise((resolve, reject) => {
      adminWebModel.getUserList(data).then((data) => {
        if (data) {
          let token = jwt.sign({ uid: uid }, key.JWT_SECRET_KEY, {
            expiresIn: timer.TOKEN_EXPIRATION
          })
          
          resolve({ code: code.OK, message: '', data: { 'token': token, 'userlist': data} })
        }
      }).catch((err) => {
        if (err.message === message.INTERNAL_SERVER_ERROR)
          reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
        else
          reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
      })
    })
  }

  
module.exports = webService

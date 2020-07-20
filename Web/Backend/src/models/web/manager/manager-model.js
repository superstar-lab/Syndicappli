/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../../../database/database')
var message  = require('../../../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table  = require('../../../constants/table')
const s3Helper = require('../../../helper/s3helper')
const s3buckets = require('../../../constants/s3buckets')
const timeHelper = require('../../../helper/timeHelper')

var managerModel = {

  getManagerList: getManagerList,
  getCountManagerList: getCountManagerList,
  checkDuplicateManager: checkDuplicateManager,
  createManager: createManager,
  getManager: getManager,
  updateManager: updateManager,
  deleteManager: deleteManager
}


/**
 * get manager list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getManagerList(uid, data) {
    return new Promise((resolve, reject) => {
      let query = `Select *, u.userID ID, u.email email from ` + table.USERS + 
                  ` u left join ` + table.USER_RELATIONSHIP + 
                  ` r using (userID) left join ` + table.BUILDINGS + 
                  ` b on b.buildingID = r.relationID ` +
                  ` where u.permission = "active" and u.usertype = "manager" and u.firstname like ? and u.lastname like ? `
      search_key = '%' + data.search_key + '%'
      let params = [search_key, search_key, uid];
      if (data.buildingID != -1) {
        query += ` and b.buildingID = ?`
        params.push(data.buildingID)
      }
      
      sort_column = Number(data.sort_column);
      row_count = Number(data.row_count);
      page_num = Number(data.page_num);
      
      if (sort_column === -1)
        query += ' order by u.userID desc';
      else {
          if (sort_column === 0)
            query += ' order by u.firstname ';
          else if (sort_column === 1) 
            query += ' order by u.lastname ';
          else if (sort_column === 2)
            query += ' order by u.email ';
          else if (sort_column === 3) {
            query += ' order by u.phone'
          }
          
          query += data.sort_method;
      }
      query += ' limit ' + page_num * row_count + ',' + row_count
      db.query(query, params, (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(rows);
        }
      })
    })
  }

/**
 * get count for building list for search filter
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCountManagerList(uid, data) {
    return new Promise((resolve, reject) => {
      let query = `Select count(*) count from ` + table.USERS + 
      ` u left join ` + table.USER_RELATIONSHIP + 
      ` r using (userID) left join ` + table.BUILDINGS + 
      ` b on b.buildingID = r.relationID ` +
      ` where u.permission = "active" and u.usertype = "manager" and u.firstname like ? and u.lastname like ? `
      search_key = '%' + data.search_key + '%'
      let params = [search_key, search_key, uid];
      if (data.buildingID != -1) {
        query += ` and b.buildingID = ?`
        params.push(data.buildingID)
      }
     
      db.query(query, params , (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(rows[0].count)  
        }
      })
    })
  }

  
/**
 * verify duplicate manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function checkDuplicateManager(data) {
  return new Promise((resolve, reject) => {
    let confirm_query = 'Select * from ' + table.USERS + ' where email = ?';

    db.query(confirm_query, [data.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0)
          reject({ message: message.MANAGER_ALREADY_EXIST })
        else {
          resolve("ok")
        }
      }
    })
  })
}

/**
 * create manager data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createManager(uid, data, file) {
  return new Promise( async (resolve, reject) => {
    let file_name
    let query
    let params = []
    let password = bcrypt.hashSync("123456")
    if (file)  {
      uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.AVATAR)
      file_name = uploadS3.Location
    }
    if (file_name == "") {
      query = 'Insert into ' + table.USERS + ' (usertype, firstname, lastname, email, password, phone, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      params = [ "manager", data.firstname, data.lastname, data.email, password, data.phone, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
    } else {
      query = 'Insert into ' + table.USERS + ' (usertype, firstname, lastname, email, password, phone, photo_url, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      params =[ "manager", data.firstname, data.lastname, data.email, password, data.phone, file_name, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
    }
    
    db.query(query, params, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let query = 'select * from ' + table.USERS + ' where email = ?'
        db.query(query, [data.email], async (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR})
          } else {
            let managerID = rows[0].userID;
            let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) Values ?`
            let buildingID = JSON.parse(data.buildingID);
            let param = [];
            for (let i in buildingID) {
              param.push([managerID,"building", buildingID[i]])
            }
            db.query(query, [param], (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                let query = 'insert into ' + table.ROLE + ' (userID, role_name, permission) values ?'
                let permission_info = JSON.parse(data.permission_info);
                let params = []
                for (let i in permission_info) {
                  params.push([managerID, permission_info[i].role_name, permission_info[i].permission])
                }
                db.query(query, [params], (error, rows, fields) => {
                  if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                  } else {
                    resolve("ok");
                  }
                })
              }
            })
          }
        })

      }
    })
  })
}

/**
 * get manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getManager(uid) {
  return new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {
      let query = 'Select * from ' + table.USERS + ' where userID = ?' 
      
      db.query(query, [ uid ], (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
              if (rows.length == 0)
                  reject({ message: message.INTERNAL_SERVER_ERROR })
              else {
                  let query = 'Select * from ' + table.ROLE + ' where userID = ?'
                  db.query(query, [uid], (error, roles, fields) => {
                      if (error) {
                          reject({ message: message.INTERNAL_SERVER_ERROR })
                      } else {
                          let response = rows[0]
                          for (let i = 0 ; i < roles.length ; i++ ) {
                              response[roles[i].role_name] = roles[i].permission
                          }
                          let query = 'Select * from ' + table.USER_RELATIONSHIP + ' where userID = ?'
                          db.query(query, [uid], (error, rows1, fields) => {
                            if (error) {
                              reject({ message: message.INTERNAL_SERVER_ERROR});
                            } else {
                              resolve({user: response, buildingList: rows1})
                            }
                          })
                      }
                  })
              }     
          }
      })
    })
  })
}

/**
 * update manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateManager( id, data, file) {
  return new Promise( async (resolve, reject) => {
      let file_name = ""
      let query
      let params = []
      if (file)  {
        uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.AVATAR)
        file_name = uploadS3.Location
      }
      if (file_name == "") {
        query = 'UPDATE ' + table.USERS + ' SET firstname = ?, lastname = ?, email = ?, phone = ?, updated_at = ? WHERE userID = ?'
        params = [ data.firstname, data.lastname, data.email, data.phone, timeHelper.getCurrentTime(), id ]
      } else {
        query = 'UPDATE ' + table.USERS + ' SET firstname = ?, lastname = ?, email = ?, phone = ?, photo_url = ?, updated_at = ? WHERE userID = ?'
        params = [ data.firstname, data.lastname, data.email, data.phone, file_name, timeHelper.getCurrentTime(), id ]
      }

      db.query(query, params,   (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            let query = 'Delete from ' + table.ROLE + ' where userID = ?' 
            db.query(query, [id], async (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
              } else {
                let query = `Delete from ` + table.USER_RELATIONSHIP + ` where userID = ?`
                db.query(query, [id], (error, rows, fields) => {
                  if (error) {
                      reject({ message: message.INTERNAL_SERVER_ERROR })
                  } else {
                    let managerID = id;
                    let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) Values ?`
                    let buildingID = JSON.parse(data.buildingID);
                    let param = [];
                    for (let i in buildingID) {
                      param.push([managerID,"building", buildingID[i]])
                    }
                    db.query(query, [param], (error, rows, fields) => {
                      if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                      } else {
                        let query = 'insert into ' + table.ROLE + ' (userID, role_name, permission) values ?'
                        let permission_info = JSON.parse(data.permission_info);
                        let params = []
                        for (let i in permission_info) {
                          params.push([managerID, permission_info[i].role_name, permission_info[i].permission])
                        }
                        db.query(query, [params], (error, rows, fields) => {
                          if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                          } else {
                            resolve("ok");
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
      })
  })
}

/**
 * delete manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteManager(uid, id) {
  return new Promise((resolve, reject) => {
      let query = 'UPDATE ' + table.USERS + ' SET  permission = "trash", deleted_by = ?, deleted_at = ? where userID = ?'

      db.query(query, [ uid, timeHelper.getCurrentTime(), id ], (error, rows, fields) => {
          if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
              resolve("ok")
          }
      })
  })
}

module.exports = managerModel

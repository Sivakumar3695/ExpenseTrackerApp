var userObj = require('../dbPersistence/Users');
var selectObj = require('../dbPersistence/selectObj');
var updateObj = require('../dbPersistence/updateObj');
var crObj = require('../dbPersistence/criteriaObj');
var accountHandler = require('./accountHandler');
var accEnum = require('../enums/accounttype');
var hanlderObj = { };
var invoke = function(methodName, params)
{
  return hanlderObj[methodName](params);
}

hanlderObj.createUser = async function(params)
{
  console.log('user creation call');
  let dbtransaction = require('../dbPersistence/dbtransaction.js')
  let dbTxn = new dbtransaction()

  var user = new userObj(params.UserName, params.Email, params.Password)
  dbTxn.addTxnInsertQuery(user)

  var acc = new accObj("\'ExpenseAccount\'", "\'To track the expense of the user\'", 0, accEnum.getCode('expense'))
  dbTxn.addTxnInsertQuery(acc)

  acc = new accObj("\'LiabilityAccount\'", "\'To track the liaiblity of the user\'", 0, accEnum.getCode('liability'))
  dbTxn.addTxnInsertQuery(acc)

  return dbTxn.commitTransaction();
}

hanlderObj.getUserDetails = function(userId)
{
  var selectObject = new selectObj('Users').selectColumns('UserID, UserName, Email').setCriteria(new crObj().addCriteria('UserID', userId, '='))
  return selectObject.get();
}

hanlderObj.updateUserDetails = async function(updateParam)
{
  try{
    await validateIfUserExists(updateParam.userID)
    var updateObject = new updateObj('Users');
    updateObject.addUpdateColumn(updateParam);
    updateObject.setCriteria(new crObj().addCriteria('UserID', updateParam.userID, '='))
    return await updateObject.update()
  }
  catch(err){
    return Promise.reject(err);
  }
}

var validateIfUserExists = async function(userId){
  try{
    var result = await hanlderObj.getUserDetails(userId)
    if (result.length == 0){
      throw new Error('User not found')
    }
  }
  catch(err){
    throw err;
  }
}

module.exports.invoke = invoke;

var accObj = require('../dbPersistence/Accounts');
var accEnum = require('../enums/accounttype');
var selectObj = require('../dbPersistence/selectObj');
var updateObj = require('../dbPersistence/updateObj');
var crObj = require('../dbPersistence/criteriaObj');

var hanlderObj = { };
var accountHandlerObj = {};
var invoke = function(methodName, params)
{
  return hanlderObj[methodName](params);
}

var createAccount = async function(params, accountType)
{
  try{
    await validateIfAccNameAlreadyExist(params.AccountName);
    var acc = new accObj(params.AccountName, params.Description, params.OpeningBalance, accountType);
    return acc.create();
  }
  catch(err){
    return Promise.reject(err)
  }
}
hanlderObj.createCashAccount = function(params)
{
  return createAccount(params, accEnum.getCode('cash'));
}
// hanlderObj.createExpenseAccount = function(params)
// {
//   createAccount(params, accEnum.getCode('expense'));
//   console.log('account Creation call success');
// }
// hanlderObj.createLiabilityAccount = function(params)
// {
//   createAccount(params, accEnum.getCode('liability'));
//   console.log('account Creation call success');
// }

hanlderObj.getAccountDetails = function(accountID)
{
  var selectObject = new selectObj('AccountsTable').selectColumns('AccountID, AccountName, Description, OpeningBalance');
  let criteria = new crObj().addCriteria('AccountType', '(2,4)', 'NOT IN').addCriteria('Status', 1, '=');
  if (accountID) {
    criteria.addCriteria('AccountID', accountID, '=');
  }
  selectObject.setCriteria(criteria);
  return selectObject.get();
}

//this function should not be exposed any URI which can directly accessed by the end user
accountHandlerObj.getAccountDetailsUsingAccName = function(accountName)
{
  var selectObject = new selectObj('AccountsTable').selectColumns('AccountID, AccountName, Description, OpeningBalance');
  let criteria = new crObj().addCriteria('Status', 1, '=')
  if (accountName) {
    criteria.addCriteria('AccountName', accountName, '=');
  }
  selectObject.setCriteria(criteria);
  return selectObject.get();
}

accountHandlerObj.getExpenseAccDetails = function()
{
  return this.getAccountDetailsUsingAccName('\'ExpenseAccount\'');
}

accountHandlerObj.getLiabilityAccDetails = function()
{
  return this.getAccountDetailsUsingAccName('\'LiabilityAccount\'');
}

hanlderObj.updateAccountDetails = async function(updateParam)
{
  try{
    await validateIfAccExists(updateParam.accountID)
    await validateIfAccNameAlreadyExist(updateParam.AccountName, updateParam.accountID)

    var updateObject = new updateObj('AccountsTable')
    updateObject.addUpdateColumn(updateParam)
    updateObject.setCriteria(new crObj().addCriteria('AccountID', updateParam.accountID, '='))
    return updateObject.update()
  }
  catch(err){
    return Promise.reject(err)
  }
}

var validateIfAccNameAlreadyExist = async function(accountName, accountID)
{
  try{
    var selectObject = new selectObj('AccountsTable').selectColumns('AccountID, AccountName, Description, OpeningBalance')
    let criteria = new crObj().addCriteria('AccountType', '(2,4)', 'NOT IN').addCriteria('Status', 1, '=')
    criteria.addCriteria('AccountName', accountName, '=')
    if (accountID) {
      criteria.addCriteria('AccountID', accountID, '!=');
    }

    selectObject.setCriteria(criteria)
    var result = await selectObject.get()
    if (result.length > 0) {
      throw new Error('Account with same name already exists.');
    }
  }
  catch(err){
    throw err
  }
}

var validateIfAccExists = async function(accountId){
  try{
    var result = await hanlderObj.getAccountDetails(accountId)
    console.log(result);
    if (result.length == 0){
      throw new Error('Account not found')
    }
  }
  catch(err){
    throw err;
  }
}
module.exports =
{
  invoke : invoke,
  accountHandlerObj : accountHandlerObj
}

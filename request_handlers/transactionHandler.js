var transactionClassObj = require('../dbPersistence/Transaction');
var transactionDetailsClassObj = require('../dbPersistence/TransactionDetails');
var txnEnum = require('../enums/transactionType');
var selectObj = require('../dbPersistence/selectObj');
var updateObj = require('../dbPersistence/updateObj');
var crObj = require('../dbPersistence/criteriaObj');
var accountHandlerObj = require('./accountHandler.js').accountHandlerObj;

var hanlderObj = { };
var invoke = function(methodName, params)
{
  return hanlderObj[methodName](params);
}

hanlderObj.getTransactionDetails = function(transactionId)
{
  var selectObject = new selectObj('TransactionTable').selectColumns('TransactionTable.TransactionID, TransactionType, TransactionTable.Details, TransactionTable.Amount, TransactionDate, AccountName').setCriteria(new crObj().addCriteria('TransactionTable.TransactionID', transactionId, '='))
  selectObject.addInnerJoin('TransactionDetailsTable', new crObj().addCriteria('TransactionTable.TransactionID', 'TransactionDetailsTable.TransactionID', '='))
  selectObject.addInnerJoin('AccountsTable', new crObj().addCriteria('TransactionDetailsTable.AccountID', "AccountsTable.AccountID", '=').addCriteria("AccountType", "(2,4)","NOT IN"))
  return selectObject.get();
}

hanlderObj.updateTransactionDetails = async function(updateParam)
{
  try{
    await validateIfTransactionExists(updateParam.transactionID)

    let dbtransaction = require('../dbPersistence/dbtransaction.js')
    let dbTxn = new dbtransaction()

    var accountDetails = await accountHandlerObj.getAccountDetailsUsingAccName(updateParam.AccountName)
    delete updateParam.AccountName

    var updateObject = new updateObj('TransactionTable')
    updateObject.addUpdateColumn(updateParam);
    updateObject.setCriteria(new crObj().addCriteria('TransactionID', updateParam.transactionID, '='))
    dbTxn.addTxnUpdateQuery(updateObject)

    updateObject = new updateObj('TransactionDetailsTable')
    updateObject.setCriteria(new crObj().addCriteria('TransactionID', updateParam.transactionID, '='))
    dbTxn.addTxnDeleteQuery(updateObject)

    updateParam.AccountID = accountDetails[0].AccountID
    handleTransactionDetailsTable(dbTxn, updateParam.transactionID, updateParam)

    return dbTxn.commitTransaction()
  }
  catch(err){
    return Promise.reject(err);
  }
}

hanlderObj.recordTransaction = async function(params)
{
  try{

    var accountDetails = await accountHandlerObj.getAccountDetailsUsingAccName(params.AccountName)
    let accId = accountDetails[0].AccountID
    params.AccoutnID = accId

    let dbtransaction = require('../dbPersistence/dbtransaction.js')
    let dbTxn = new dbtransaction()
    var transactionObj = new transactionClassObj(params.TransactionType, params.Details, params.Amount, params.TransactionDate)
    dbTxn.addTxnInsertQuery(transactionObj);

    handleTransactionDetailsTable(dbTxn, undefined, params)
    return dbTxn.commitTransaction()
  }
  catch(err){
    return Promise.reject(err)
  }
}

hanlderObj.getAccountDetails = function(accountID)
{
  var selectObject = new selectObj('AccountsTable').selectColumns('AccountID, AccountName, Description, OpeningBalance')
  let criteria = new crObj().addCriteria('AccountType', '(2,4)', 'NOT IN').addCriteria('Status', 1, '=')
  if (accountID) {
    criteria.addCriteria('AccountID', accountID, '=')
  }
  selectObject.setCriteria(criteria)
  return selectObject.get()
}

hanlderObj.deleteTransaction = async function(transactionId)
{
  try{
    await validateIfTransactionExists(transactionId)
    var updateObject = new updateObj('TransactionTable')
    updateObject.setCriteria(new crObj().addCriteria('TransactionID', transactionId, '='))
    return updateObject.delete()
  }
  catch(err){
    return Promise.reject(err);
  }
}

var validateIfTransactionExists = async function(transactionId){
  try{
    var result = await hanlderObj.getTransactionDetails(transactionId)
    if (result.length == 0){
      throw new Error('Transaction not found')
    }
  }
  catch(err){
    throw err;
  }
}

async function handleTransactionDetailsTable(dbTxn, transactionId, params)
{
  try
  {
    let isDebit = params.TransactionType == txnEnum.getCode('income') ? true : false
    var transactionDetailsObj = new transactionDetailsClassObj(params.Amount, isDebit, params.AccountID)
    transactionDetailsObj.setTransactionId(transactionId);
    //console.log(transactionDetailsObj['FK']);
    dbTxn.addTxnInsertQuery(transactionDetailsObj);

    //console.log('Check: ' + params.TransactionType + txnEnum.getCode('expense'));
    if (params.TransactionType == txnEnum.getCode('expense'))
    {
      let accountDetails = await accountHandlerObj.getExpenseAccDetails()
      console.log(accountDetails)
      let expenseAccId = accountDetails[0].AccountID
      transactionDetailsObj = new transactionDetailsClassObj(params.Amount, !isDebit, expenseAccId)
      transactionDetailsObj.setTransactionId(transactionId)
      dbTxn.addTxnInsertQuery(transactionDetailsObj)
    }
    else if (params.TransactionType == txnEnum.getCode('liability'))
    {
      let accountDetails = await accountHandlerObj.getLiabilityAccDetails()
      let liabilityAccId = accountDetails[0].AccountID
      transactionDetailsObj = new transactionDetailsClassObj(params.Amount, !isDebit, liabilityAccId)
      transactionDetailsObj.setTransactionId(transactionId)
      dbTxn.addTxnInsertQuery(transactionDetailsObj)
    }
  }
  catch (e)
  {
    throw e
  }
}
module.exports.invoke = invoke;

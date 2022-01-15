let date = require('date-and-time');
const userNodeDetailsObj = [
  {apiNode: 'user_name', dbColumn: 'UserName', format: '[a-zA-Z0-9]+'},
  {apiNode: 'user_mail', dbColumn: 'Email', format: '[a-zA-Z].*@.*\..*'},
  {apiNode: 'password', dbColumn: 'Password', format: '.*'},
  {apiNode: 'user_id', dbColumn: 'UserID', format: '[0-9]+'}
]

const accountNodeDetailsObj = [
  {apiNode: 'account_name', dbColumn: 'AccountName', format: '[a-zA-Z0-9]+'},
  {apiNode: 'description', dbColumn: 'Description', format: '[a-zA-Z].*@.*\..*'},
  {apiNode: 'opening_balance', dbColumn: 'OpeningBalance', format: '[0-9]*'},
  {apiNode: 'account_id', dbColumn: 'AccountID', format: '[0-9]+'},
  {apiNode: 'effective_from', dbColumn: 'EffectiveFrom', format: '[0-9]+'}
]

const transactionNodeDetailsObj = [
  {apiNode: 'amount', dbColumn: 'Amount', format: '[1-9][0-9]*'},
  {apiNode: 'details', dbColumn: 'Details', format: '.*'},
  {apiNode: 'transaction_type', dbColumn: 'TransactionType', enumVal:'../enums/transactionType', format: '.*'},
  {apiNode: 'transaction_date', dbColumn: 'TransactionDate', type:'Date', format: '.*'},
  {apiNode: 'account', dbColumn: 'AccountName', format: '.*'},
  {apiNode: 'transaction_id', dbColumn: 'TransactionID', format: '[0-9]+'}
]

const nodeDetailsMap = [
  {key : 'userDetailsNode', object: userNodeDetailsObj},
  {key : 'accountDetailsNode', object: accountNodeDetailsObj},
  {key : 'transactionDetailsNode', object: transactionNodeDetailsObj}
]

var getObjectForRequestBody = function(formatDetails, requestBody){
  let nodeDetails;
  for (var i=0; i< nodeDetailsMap.length; i++){
    if (nodeDetailsMap[i].key === formatDetails) {
      nodeDetails = nodeDetailsMap[i].object;
      break;
    }
  }

  let returnObj = {};
  for (var i = 0; i < nodeDetails.length; i++) {
    let apiNode = nodeDetails[i].apiNode;
    let dbColumn = nodeDetails[i].dbColumn;
    let nodeType = nodeDetails[i].type;
    let enumVal = nodeDetails[i].enumVal;
    if (requestBody[apiNode]) {
      if (nodeType === 'Date') {
        var dateValue = new Date(requestBody[apiNode]);
        var timeInMillis = dateValue.getTime();
        // console.log(new Date());
        // console.log(new Date(1551398400000 - dateValue.getTimezoneOffset() * 60000));
        console.log(date.format(new Date(1551398400000 - dateValue.getTimezoneOffset() * 60000), 'YYYY/MM/DD'));
        returnObj[dbColumn] = "\'" + timeInMillis + "\'";
      }
      else if (enumVal) {
        let enumType = require(enumVal)
        returnObj[dbColumn] = "" + enumType.getCode(requestBody[apiNode]) + "";
      }
      else{
        returnObj[dbColumn] = "\'" + requestBody[apiNode] + "\'";
      }
    }
  }
  return returnObj;
}

var getObjectForResponse = function(formatDetails, result){
  let nodeDetails;

  for (var i=0; i< nodeDetailsMap.length; i++){
    if (nodeDetailsMap[i].key === formatDetails) {
      nodeDetails = nodeDetailsMap[i].object;
      break;
    }
  }

  let returnObj = {};
  for (var i = 0; i < nodeDetails.length; i++) {
    let apiNode = nodeDetails[i].apiNode;
    let dbColumn = nodeDetails[i].dbColumn;
    let nodeType = nodeDetails[i].type;
    let enumVal = nodeDetails[i].enumVal;
    if (result[dbColumn]) {
      if (nodeType === 'Date') {
        var dateValue = new Date(result[dbColumn] - new Date().getTimezoneOffset() * 60000);
        returnObj[apiNode] = date.format(dateValue, 'YYYY-MM-DD');
      }
      else if (enumVal) {
        let enumType = require(enumVal)
        returnObj[apiNode] = enumType.getName(result[dbColumn]);
      }
      else{
        returnObj[apiNode] = result[dbColumn];
      }
    }
  }
  return returnObj;
}

module.exports = {
  getObjectForRequestBody : getObjectForRequestBody,
  getObjectForResponse : getObjectForResponse
}

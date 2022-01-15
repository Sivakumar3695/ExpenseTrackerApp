//var mysql = require('mysql');
var dbOp = require('./dboperations.js');
var transactionObj = class TransactionDetailsTable extends dbOp {
  constructor(Amount, IsDebit, AccountID) {
    super();
    this.Amount = Amount;
    this.IsDebit = IsDebit;
    this.AccountID = AccountID;
  }

  create()
  {
    return super.create();
  }

  setTransactionId(transactionId)
  {
    if (transactionId) {
      this.TransactionID = transactionId
      return
    }
    this.TransactionID = '${' + this['FK'] + '}'
  }
}
transactionObj.prototype['FK']='TransactionTable_PK'

module.exports = transactionObj;

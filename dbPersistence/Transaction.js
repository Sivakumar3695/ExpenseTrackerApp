//var mysql = require('mysql');
var dbOp = require('./dboperations.js');
var transactionObj = class TransactionTable extends dbOp {
  constructor(TransactionType, Details, Amount, TransactionDate) {
    super();
    this.TransactionType = TransactionType;
    this.Details = Details;
    this.Amount = Amount;
    this.TransactionDate = TransactionDate;
  }

  set createdTime(CreatedTime)
  {
    this.CreatedTime = CreatedTime;
  }

  get createdTime()
  {
    return this.CreatedTime;
  }

  create()
  {
    this.CreatedTime = new Date().getTime();
    return super.create();
  }
}
module.exports = transactionObj;

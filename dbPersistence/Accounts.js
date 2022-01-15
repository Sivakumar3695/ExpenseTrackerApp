//var mysql = require('mysql');
var dbOp = require('./dboperations.js');
var accObj = class AccountsTable extends dbOp {
  constructor(AccountName, Description, OpeningBalance, AccountType) {
    super();
    this.AccountName = AccountName;
    this.Description = Description;
    this.OpeningBalance = OpeningBalance;
    this.AccountType = AccountType;
  }

  set accountID(accountID)
  {
    this.AccountID = accountID;
  }

  get accountID()
  {
    return this.AccountID;
  }

  set effectiveFrom(EffectiveFrom)
  {
    this.EffectiveFrom = EffectiveFrom;
  }

  get effectiveFrom()
  {
    return this.EffectiveFrom;
  }

  create()
  {
    this.EffectiveFrom = new Date().getTime();
    return super.create();
  }
}
module.exports = accObj;

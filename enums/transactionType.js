var Enum = require('enum');

var transactionEnum = new Enum(['income', 'expense', 'liability', 'account_adjustment']);

var getCode = function(txn)
{
  console.log(transactionEnum.get(txn).value);
  return transactionEnum.get(txn).value;
}

var getName = function(code)
{
  console.log(transactionEnum.get(code).key);
  return transactionEnum.get(code).key;
}

module.exports = {
  getCode : getCode,
  getName :  getName
}

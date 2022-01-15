var Enum = require('enum');

var accEnum = new Enum(['cash', 'expense', 'liability']);

var getCode = function(acc)
{
  console.log(accEnum.get(acc).value);
  return accEnum.get(acc).value;
}

var getName = function(code)
{
  console.log(accEnum.get(code).key);
  return accEnum.get(code).key;
}

module.exports = {
  getCode : getCode,
  getName :  getName
}

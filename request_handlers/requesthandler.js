var processRequest = function(file, methodKey, params)
{
  var file = require(file);
  return file.invoke(methodKey, params);
}

module.exports.process = processRequest;

var getResponse = function(promiseObj, msg, next, res)
{
  promiseObj.then(function(){
    res.status(200).send({message: msg})
  })
  .catch(function(err){
    console.log('Error while processing...' + err);
    next(err);
  })
}

module.exports.getResponse = getResponse

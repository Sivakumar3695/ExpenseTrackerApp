var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodeValueHandler = require('./nodeDetailsHandler');
var requestHandler = require('../request_handlers/requestHandler');
var responseHandler = require('./responseHandler')

router.use(bodyParser.json());
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('', function(req, res)
{
  var requireFile = "./accountHandler";
  var methodKey = "getAccountDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey);
  promiseObj.then(function(result){
    let resObjArr = [];
    for (var i = 0; i < result.length; i++) {
      resObjArr.push(nodeValueHandler.getObjectForResponse('accountDetailsNode', result[i]));
    }
    res.send(resObjArr);
  })
  .catch(function(err){
    next(err);
  })
});

router.get('/:accountID', function(req, res)
{
  var requireFile = "./accountHandler";
  var methodKey = "getAccountDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey, req.params.accountID);
  promiseObj.then(function(result){
    if (result.length != 0) {
      let responseObj = nodeValueHandler.getObjectForResponse('accountDetailsNode', result[0]);
      res.send(responseObj);
    }
    else{
      res.status(201).send({message: 'Account details not found'});
    }
  })
  .catch(function(err){
    next(err);
  })
  //res.send('Hi, here is the accountID you requested:' + req.params.accountID);
});

router.put('/:accountID', function(req, res, next)
{
  let paramObject = nodeValueHandler.getObjectForRequestBody('accountDetailsNode', req.body);
  paramObject.accountID = req.params.accountID;

  var requireFile = "./accountHandler";
  var methodKey = "updateAccountDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey, paramObject);
  responseHandler.getResponse(promiseObj, 'Account details has been successfully updated.', next, res);
});

router.post('', function(req, res, next)
{
  var requireFile = "./accountHandler";
  var methodKey = "createCashAccount";
  let paramObject = nodeValueHandler.getObjectForRequestBody('accountDetailsNode', req.body);
  var promiseObj = requestHandler.process(requireFile, methodKey, paramObject);
  responseHandler.getResponse(promiseObj, 'Account has been successfully added.', next, res);
});

router.delete('/:accountID', function(req, res)
{
  //should validate if the account is associated with any transaction.
  res.send('Hi, this is an deletion request for the AccoutnID:' + req.params.accountID);
});

module.exports = router;

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodeValueHandler = require('./nodeDetailsHandler');
var requestHandler = require('../request_handlers/requestHandler');
var responseHandler = require('./responseHandler')

router.use(bodyParser.json());
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('', function(req, res)
{
  console.log('This is a transactions get request');
  res.send('Hi, here is the transactions list');
});

router.get('/:transactionID', function(req, res, next)
{
  var requireFile = "./transactionHandler";
  var methodKey = "getTransactionDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey, req.params.transactionID);
  promiseObj.then(function(result){
    console.log(result[0]);
    let responseObj = nodeValueHandler.getObjectForResponse('transactionDetailsNode', result[0]);
    res.send(responseObj);
  })
  .catch(function(err){
    next(err);
  })
});

router.put('/:transactionID', function(req, res, next)
{
  let paramObject = nodeValueHandler.getObjectForRequestBody('transactionDetailsNode', req.body);
  paramObject.transactionID = req.params.transactionID;

  var requireFile = "./transactionHandler";
  var methodKey = "updateTransactionDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey, paramObject);
  responseHandler.getResponse(promiseObj, 'Your transaction has been successfully updated.', next, res);});

router.post('', function(req, res, next)
{
  var requireFile = "./transactionHandler";
  var methodKey = "recordTransaction";
  let paramObject = nodeValueHandler.getObjectForRequestBody('transactionDetailsNode', req.body);
  var promiseObj = requestHandler.process(requireFile, methodKey, paramObject);
  responseHandler.getResponse(promiseObj, 'Your transaction has been successfully recorded.', next, res);
  //res.send('Hi, this is an new transactions record');
});

router.delete('/:transactionID', function(req, res, next)
{
  var requireFile = "./transactionHandler";
  var methodKey = "deleteTransaction";
  var promiseObj = requestHandler.process(requireFile, methodKey, req.params.transactionID);
  responseHandler.getResponse(promiseObj, 'Your transaction has been successfully deleted.', next, res);
  //res.send('Hi, this is an deletion request for the transactionID:' + req.params.transactionID);
});

module.exports = router;

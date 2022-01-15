var express = require('express');
var router = express.Router();
var requestHandler = require('../request_handlers/requestHandler');
var nodeValueHandler = require('./nodeDetailsHandler');
var responseHandler = require('./responseHandler')

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next();
})


//for /api/users get request
router.get('', function(req, res)
{
  console.log('This is a user get request');
  res.send('Hi, here is the user list');
});

router.get('/:userID', function(req, res)
{
  var requireFile = "./userhandler";
  var methodKey = "getUserDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey, req.params.userID);
  promiseObj.then(function(result){
    console.log(result[0]);
    let responseObj = nodeValueHandler.getObjectForResponse('userDetailsNode', result[0]);
    res.send(responseObj);
  })
  .catch(function(err){
    next(err);
  })
});

router.put('/:userID', function(req, res, next)
{
  let paramObject = nodeValueHandler.getObjectForRequestBody('userDetailsNode', req.body);
  paramObject.userID = req.params.userID;

  var requireFile = "./userhandler";
  var methodKey = "updateUserDetails";
  var promiseObj = requestHandler.process(requireFile, methodKey, paramObject);
  responseHandler.getResponse(promiseObj, 'User details has been successfully updated.', next, res);
});

router.post('', function(req, res, next)
{
  let paramObject = nodeValueHandler.getObjectForRequestBody('userDetailsNode', req.body)
  // res.send('Hi, this is an user update request. UserID:' + req.params.userID + ',userName:' + req.body.name);
  var requireFile = "./userhandler"
  var methodKey = "createUser"
  var promiseObj = requestHandler.process(requireFile, methodKey, paramObject)
  responseHandler.getResponse(promiseObj, 'User has been successfully created.', next, res)
});

router.get('/liabilityUsers', function(req, res)
{
  console.log('This is a liability user get request');
  res.send('Hi, here is the liability user list');
});

router.get('/liabilityUsers/:userID', function(req, res)
{
  res.send('Hi, here is the liability userID you requested:' + req.params.userID);
});

router.put('/liabilityUsers/:userID', function(req, res)
{
  console.log('Name:' + req.body.name);
  res.send('Hi, this is an update request for the liability userID:' + req.params.userID + 'userName:' + req.body.name);
});

router.post('/liabilityUsers', function(req, res)
{
  console.log('Name:' + req.body.name);
  res.send('Hi, this is an liability user update request. Liability UserID:' + req.params.userID + ',userName:' + req.body.name);
});

router.delete('/liabilityUsers/:userID', function(req, res)
{
  //should validate if the liaiblity user is associated with any liability transaction.
  res.send('Hi, this is an liability user delete request. UserID:' + req.params.userID + ',userName:' + req.body.name);
});

module.exports = router;

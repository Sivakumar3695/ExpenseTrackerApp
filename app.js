var express = require('express');
var app = express();
var mysql = require('./dbPersistence/dbconnection');
var EventEmitter = require('events');
var eventChecker = new EventEmitter();

mysql.connectTomysql();

var userRouter = require('./routes/userRouter');
var accRouter = require('./routes/accountsRouter');
var transactionRouter = require('./routes/transactionRouter');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/accounts', accRouter);
app.use('/api/transactions', transactionRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  console.log('Exception caught in App js error handler');
  var errMsg = 'Oops...Internal Error';
  if (err.message) {
    errMsg = err.message;
  }
  res.status(500).send({message: errMsg})
})
app.listen(3000);
//https://www.npmjs.com/package/node-mysql-transaction

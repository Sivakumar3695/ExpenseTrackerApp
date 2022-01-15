var mysql = require('./dbPersistence/dbconnection');
var dbOp = require('./dbPersistence/dboperations');
var pool = mysql.pool;
async function test()
{
  try{
    var result = await test2();
    //console.log('hoho');
    //console.log(result);
    return result;
  }
  catch(err){
    return Promise.reject(err);
  }
  //test2();
  //return new Promise(function(resolve, reject){

  //});
}

async function test2()
{
  try{
    var result = await new dbOp().executeQuery('Select * from AccountsTable');
    console.log('done');
    return result;
  }
  catch(err){
    throw err;
  }
}

function test3(){
  return test()
}

console.log('start');
test()
.then(r => console.log(r))
.catch(e => console.log('failure'));
console.log('end');

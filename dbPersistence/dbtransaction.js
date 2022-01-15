var mysql = require('mysql')

var dbTxn = class DbTransaction
{
  constructor(){
    this.connection = mysql.createConnection(
      {
        host: "localhost",
        user: "sivakumar",
        password:""
      }
    );
    this.queryList = []
    this.tablePkList = []
  }

  addTxnInsertQuery(obj)
  {
    let sql = obj.getInsertQuery()
    this.tablePkList.push(getTableDetailsMap(obj.constructor.name, obj))
    this.addTxnQuery(sql)
  }

  addTxnUpdateQuery(obj)
  {
    let sql = obj.getUpdateQuery()
    this.tablePkList.push(getTableDetailsMap(obj.baseTable, obj))
    this.queryList.push(sql)
  }

  addTxnDeleteQuery(obj)
  {
    let sql = obj.getDeleteQuery()
    this.tablePkList.push(getTableDetailsMap(obj.baseTable, obj))
    this.queryList.push(sql);
  }

  addTxnQuery(sql)
  {
    this.queryList.push(sql)
  }

  commitTransaction()
  {
    var connection = this.connection
    var queryList = this.queryList
    var tablePkList = this.tablePkList
    //console.log(tablePkList);
    return new Promise(function(resolve, reject){
      connection.query('USE expenseAppDataBase', function(err){
        if (err) {
          err.message = 'Oopps...Internal Errror';
          reject(err)
        }
      })
      connection.beginTransaction(function(err){
          var callbackPromise = callback(err, connection, queryList, tablePkList, 0)
          callbackPromise.then(function(){
            console.log('success')
          })
          .catch(function(err){
            err.message = 'Oopps...Internal Errror';
            //console.log('Error caught in dbtxn callback promise...');
            reject(err)
          })
      })
      resolve()
    });
  }
}

var callback = function(err, connection, queryList, tablePkList, i){
  return new Promise(function(resolve, reject){
    if (err) {
      return connection.rollback(function(){
        reject(err)
      });
    }
    if (i < queryList.length){
      //console.log(tablePkList[i].tableName)
      console.log(queryList[i]);
      let sql = getQueryWithValuesReplaced(queryList[i], i, tablePkList)
      connection.query(sql, function(err, result){
        console.log(result);
        try {
          if (!err) {
            let pkName = tablePkList[i].tableName + '_PK'
            tablePkList[i][[pkName]] = result.insertId
            console.log('ha ha');
          }
        } catch (e) {
          console.log('Error while processing.');
          reject(e)
        }

        var callbackPromise = callback(err, connection, queryList, tablePkList, i+1)
        callbackPromise.then(function(){
          //console.log('success');
        })
        .catch(function(err){
          console.log('Error caught in dbtxn callback promise...'+err);
          reject(err)
        })
      })
    }
    else if (i == queryList.length){
      //console.log(tablePkList);
      connection.commit(function(err){
        var callbackPromise = callback(err, connection, queryList, tablePkList, i+1)
        callbackPromise.then(function(){
          //console.log('success');
        })
        .catch(function(err){
          console.log('Error caught in dbtxn callback promise...');
          reject(err)
        })
        console.log('commmit success.')
      })
    }
    else{
      resolve()
      console.log('Done.')
    }
  })
}

var getQueryWithValuesReplaced = function(sql, currentIndex, tableDetialsList){
  //console.log(tableDetialsList);
  let tableDetailsMap = tableDetialsList[currentIndex]
  if (!tableDetailsMap) {
    return sql
  }
  let tableFk = tableDetailsMap['FK']
  var substituteValue
  for (let i = 0; i < tableDetialsList.length; i++) {
    let tableDetails = tableDetialsList[i]
    if (tableFk === (tableDetails.tableName+'_PK')) {
      substituteValue = tableDetails[[tableFk]]
    }
  }
  let valueToBeSubstituted = '${'+ tableFk+'}'
  // console.log(valueToBeSubstituted);
  // console.log(substituteValue);
  sql = sql.replace(valueToBeSubstituted, substituteValue)
  //console.log(sql)
  return sql
}

function getTableDetailsMap(tableName, obj)
{
  let fk = obj['FK']
  let tablePk = tableName + '_PK'
  let tablePkMap = {'tableName' : tableName, [tablePk]: undefined, 'FK' : fk}
  return tablePkMap
}

module.exports = dbTxn;

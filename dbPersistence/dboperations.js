var mysql = require('./dbconnection.js');
var dbTxn = require('./dbtransaction.js');
var pool = mysql.pool;

var dbOp = class DbOperation
{
  constructor(){
  }

  create()
  {
    var query = this.getInsertQuery();
    var getNamespace = require('continuation-local-storage').getNamespace;
    var transaction = getNamespace('transaction');
    console.log(transaction);
    if (transaction.get('use_txn'))
    {
      var dbTxn = transaction.get('dbtransaction');
      dbTxn.addTxnQuery(query);
    }
    else {
      return this.executeQuery(query);
    }
  }

  update()
  {
    let query = this.getUpdateQuery();
    return this.executeQuery(query);
  }

  delete()
  {
    let query = this.getDeleteQuery();
    return this.executeQuery(query);
  }

  get()
  {
    var query = this.getSelectQuery();
    return this.executeQuery(query);
  }

  async executeQuery(sql)
  {
    try{
      var result = await pool.query(sql)
      console.log('Query Processed!!')
      return result
    }
    catch(err){
      console.log('Error while executing query');
      throw err;
    }
  }

  getInsertQuery()
  {
    var fieldsList = Object.getOwnPropertyNames(this);
    var sql;
    var fieldValues;
    for (var i=0; i < fieldsList.length; i++)
    {
      var field = fieldsList[i];
      if (fieldValues) {
        fieldValues = fieldValues + "," + "" + this[field] +"";
      }
      else {
        fieldValues = "" + this[field] + "";
      }
    }
    sql = "INSERT INTO " + this.constructor.name + " ("+ fieldsList +") VALUES ("+ fieldValues +")";
    console.log(sql);
    return sql;
  }

  getUpdateQuery()
  {
    let fieldsList = Object.getOwnPropertyNames(this.updateColumnObj);
    let sql;
    let setValueStr;
    for (var i=0; i < fieldsList.length; i++)
    {
      let field = fieldsList[i];
      let fieldValue = this.updateColumnObj[field];
      if (setValueStr) {
        setValueStr = setValueStr + "," + field + "=" + fieldValue;
      }
      else{
        setValueStr = field + "=" + fieldValue;
      }
    }
    sql = "UPDATE " + this.baseTable + " SET " + setValueStr + " WHERE " + this.criteriaObj.criteria;
    console.log(sql);
    return sql;
  }

  getDeleteQuery()
  {
    let sql = "DELETE FROM " + this.baseTable + " WHERE " + this.criteriaObj.criteria;
    console.log(sql);
    return sql;
  }

  getSelectQuery()
  {
    var sql = "SELECT " + this.columns + " FROM " + this.baseTable// " WHERE " + this.criteriaObj.criteria;
    for (var i = 0; i < this.joinTableList.length; i++) {
      let joinDetails = this.joinTableList[i]
      //console.log(joinDetails.criteria);
      sql = sql + " " + joinDetails.join + " " + joinDetails.tableName + " ON " + joinDetails.criteria + " "
    }
    if (this.criteriaObj) {
      console.log('Select query criteria:' + this.criteriaObj.criteria);
      sql = sql + " WHERE " + this.criteriaObj.criteria
    }
    console.log(sql);
    return sql;
  }
}

module.exports = dbOp;

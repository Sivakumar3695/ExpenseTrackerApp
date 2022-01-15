var dbOp = require('./dboperations.js');
var selectObj = class SelectObject extends dbOp
{
  constructor(baseTable){
    super();
    this.baseTable = baseTable;
    this.joinTableList = []
  }

  selectColumns(columns)
  {
    this.columns = columns;
    return this;
  }

  setCriteria(criteria)
  {
    this.criteriaObj = criteria;
    return this;
  }

  addJoin(tableName, joinType, joinCriObj)
  {
    let joinDetails = {
      tableName : tableName,
      join : joinType,
      criteria : joinCriObj.criteria
    }
    this.joinTableList.push(joinDetails)
  }

  addInnerJoin(tableName, joinCriObj)
  {
    this.addJoin(tableName, "INNER JOIN", joinCriObj)
  }

  get()
  {
    return super.get();
  }
}

module.exports = selectObj;

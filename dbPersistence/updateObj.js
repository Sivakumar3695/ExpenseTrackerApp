var dbOp = require('./dboperations.js');
var selectObj = class UpdateObject extends dbOp
{
  constructor(baseTable){
    super();
    this.baseTable = baseTable;
    this.updateColumnObj = {};
  }

  addUpdateColumn(updateColumValueObj)
  {
    this.updateColumnObj = updateColumValueObj
    return this;
  }

  setCriteria(criteria)
  {
    this.criteriaObj = criteria;
    return this;
  }

  update()
  {
    return super.update();
  }

  delete()
  {
    return super.delete();
  }
}

module.exports = selectObj;

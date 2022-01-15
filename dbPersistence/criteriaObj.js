var crObj = class CriteriaObj
{
  constructor(){

  }

  addCriteria(lhs, rhs, crType)
  {
    //console.log(this.criteria);
    if (this.criteria) {
      this.criteria = this.criteria + ' and ' + lhs + ' ' + crType + ' ' + rhs;
    }
    else {
      this.criteria = lhs + ' ' + crType + ' ' + rhs;
    }
    return this;
  }
}

module.exports = crObj;

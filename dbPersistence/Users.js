//var mysql = require('mysql');
var dbOp = require('./dboperations.js');
var userObj = class Users extends dbOp {
  constructor(UserName, Email, Password) {
    super();
    this.UserName = UserName;
    this.Email = Email;
    this.Password = Password;
  }

  set userID(userID)
  {
    this.UserID = userID;
  }

  get userID()
  {
    return this.UserID;
  }

  set createdTime(CreatedTime)
  {
    this.CreatedTime = CreatedTime;
  }

  set Status(status)
  {
    this.Status = status;
  }

  get createdTime()
  {
    return this.CreatedTime;
  }

  create()
  {
    this.CreatedTime = new Date().getTime();
    super.create();
  }
}
module.exports = userObj;

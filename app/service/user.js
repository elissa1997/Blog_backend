const Service = require('egg').Service;
const crypto = require('crypto');


// 用户增删改查、加密工具
class UserService extends Service {

  // 根据某字段查找用户
  async getUserByField(data, field){
    let { app } = this;
    let userList
    try {
      if(data) {
        userList = await app.model.User.findAll({
          where: { [field]: data }
        })
      } else {
        userList = await app.model.User.findAll()
      }
      return userList;
    } catch (e) {
      return null
    }
  }

  // 增加用户
  async createUser(data) {
    let { app,ctx } = this;
    let { name,password,email,admin } = data;
    password = ctx.service.user.md5encrypt(password);
    try {
      await app.model.User.create({
        name,
        password,
        email,
        admin
      })
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } 
  }
  // md5加密
  md5encrypt(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}

module.exports = UserService;
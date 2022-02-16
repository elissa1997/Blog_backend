'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {


  // 用户注册
  async register() {
    const { ctx } = this;
    try {
      let post_data = ctx.request.body;
      let checkUserRegistered = await ctx.service.user.getUserByField(post_data.name,"name");
      console.log(checkUserRegistered);
      if (checkUserRegistered.length == 0) {
        let res = await ctx.service.user.createUser(post_data);
        if(res) {
          ctx.body = {
            msg: 'User created successfully.',
            status: 200
          }
        } else {
          ctx.body = {
            msg: 'User created failed.',
            status: 402
          }
        }
      }else{
        ctx.body = {
          msg: 'User already exists.',
          status: 401 
        };
      }
    } catch (e) {
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }

  // 用户登录
  async login() {
    let { app,ctx } = this;
    try {
      let post_data = ctx.request.body;  
      let checkUserRegistered = await ctx.service.user.getUserByField(post_data.name,"name");  // post_data.name,"name"
      let encryPsw = await ctx.service.user.md5encrypt(post_data.password);
      if(checkUserRegistered.length && (encryPsw === checkUserRegistered[0].dataValues.password)) {
        let user_jwt = { 
          name: post_data.name,
          password: post_data.password
         };
        // 2.1.Generate token with your user-info & your secret
        let token =  app.jwt.sign(user_jwt, this.app.config.jwt.secret);
        ctx.body = {
          msg: 'Login successfully.',
          token: token,
          status: 200 
        };
      }else{
        ctx.body = {
          msg: 'Permission verification error! please input correct username or password.',
          status: 401 
        };
      }
    } catch (e) {
      
    }
  }
}

module.exports = UserController;
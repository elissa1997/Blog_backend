'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async getMsg() {
    let { ctx } = this;
    ctx.body = {
      msg: 'o(*￣︶￣*)o',
      status: 200
    }
  }
}

module.exports = TestController;
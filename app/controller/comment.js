'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {
  async getListByArticle() {
    const { ctx } = this;
    try {
      let get_data = ctx.query;
      let filter = {};
      let a_id = get_data.a_id;
      let res = await ctx.service.comment.getCommentByArticle(a_id)
      if (res) {
        ctx.body = {
          msg: 'Query successfully',
          data: res,
          status: 200
        }
      }else {
        ctx.body = {
          msg: 'Query failed',
          status: 402
        }
      }
    }catch (e) {
      // console.log(e);
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }
}

module.exports = CommentController;

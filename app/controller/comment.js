'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  // 获取评论列表
  async getList() {
    try {
      const { ctx } = this;
      let get_data = ctx.query;
      let filter = get_data.search;
      // console.log(get_data);
      let page = { 
        offset: Number(get_data.offset), 
        limits: Number(get_data.limits) 
      };
      let res = await ctx.service.comment.getCommentAllwithArticle(filter,page);
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
    } catch (e) {
      console.log(e);
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }

  // 添加评论
  async addComment() {
    const { ctx } = this;
    try {
      let post_data = ctx.request.body;
      post_data.ip = ctx.request.ip;
      let res = await ctx.service.comment.addComment(post_data);
      if (res) {
        ctx.body = {
          msg: 'Add successfully',
          data: res,
          status: 200
        }
      }else {
        ctx.body = {
          msg: 'Add failed',
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

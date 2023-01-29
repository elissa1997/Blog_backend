'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  // 获取评论列表
  async listComment() {
    try {
      const { ctx } = this;
      let get_data = ctx.query;
      let filter = get_data.search;
      // console.log(filter);
      let page = undefined;
      if(get_data.offset && get_data.limits) {
        page = { 
          offset: Number(get_data.offset), 
          limits: Number(get_data.limits) 
        };
      }
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

  async deleteComment() {
    const { ctx } = this;
    try {
      let delete_data = ctx.request.body;
      let res = await ctx.service.comment.deleteComment(delete_data);
      if (res) {
        ctx.body = {
          msg: 'Delete successfully',
          data: res,
          status: 200
        }
      }else {
        ctx.body = {
          msg: 'Delete failed',
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

  // 修改评论
  async updateComment() {
    const { ctx } = this;
    try {
      let update_data = ctx.request.body;
      let res = await ctx.service.comment.updateComment(update_data);
      if (res) {
        ctx.body = {
          msg: 'Update successfully',
          data: res,
          status: 200
        }
      }else {
        ctx.body = {
          msg: 'Update failed',
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

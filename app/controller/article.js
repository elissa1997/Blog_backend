'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {

  // 文章列表

  async getList() {
    const { ctx } = this;
    try {
      let get_data = ctx.query;
      let filter = {};
      // console.log(get_data);
      let page = { 
        offset: Number(get_data.offset), 
        limits: Number(get_data.limits) 
      };
      let res = await ctx.service.article.getArticleAll(filter,page)
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
      // console.log(res);
    } catch (e) {
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }

  // 文章详情

  async getDetail() {
    const { ctx } = this;
    try {
      let get_data = ctx.query;
      let id = get_data.a_id;
      let res = await ctx.service.article.getArticleSingle(id);
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
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }



}

module.exports = ArticleController;
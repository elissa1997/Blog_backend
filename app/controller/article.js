'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {

  // 文章列表

  async getList() {

    const { ctx } = this;
    try {
      let get_data = ctx.query;
      let filter = get_data.search;
      // console.log(get_data);
      let page = { 
        offset: Number(get_data.offset), 
        limits: Number(get_data.limits) 
      };
      let res = await ctx.service.article.getArticleAllwithComment(filter,page);
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

  // 文章详情

  async getDetail() {
    const { ctx } = this;
    try {
      let get_data = ctx.query;
      let id = get_data.a_id;
      let res = await ctx.service.article.getArticleSinglewithComment(id);
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

  // 文章添加
  async addArticle() {
    const { ctx } = this;
    try {
      let post_data = ctx.request.body;
      let res = await ctx.service.article.addArticle(post_data);
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
    } catch (e) {
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }

  // 文章删除

  async delArticle() {
    const { ctx } = this;
    try {
      let post_data = ctx.request.body;
      let res = await ctx.service.article.delArticle(post_data);
      if (res) {
        ctx.body = {
          msg: 'Del successfully',
          data: res,
          status: 200
        }
      }else {
        ctx.body = {
          msg: 'Del failed',
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
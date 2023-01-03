'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {

  // 文章列表

  async listArticle() {

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

  async detailArticle() {
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

  async deleteArticle() {
    const { ctx } = this;
    try {
      let delete_data = ctx.request.body;
      let res = await ctx.service.article.deleteArticle(delete_data);
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
    } catch (e) {
      ctx.body = {
        msg: 'Server error',
        status: 501
      }
    }
  }


  async updateArticle() {
    const { ctx } = this;
    try {
      let update_data = ctx.request.body;
      let res = await ctx.service.article.updateArticle(update_data);
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

module.exports = ArticleController;
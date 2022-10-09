const Service = require('egg').Service;
const { Op } = require("sequelize");

class ArticleService extends Service {
  
  async getArticleAllwithComment(filter,page) {
    let { app } = this;
    let where = {}
    if (filter) {
      filter = JSON.parse(filter);
      
      (filter.title === undefined)? null : where["title"] = { [Op.like]: filter.title };
      (filter.category === undefined)? null : where["category"] = { [Op.eq]: filter.category };
      (filter.status === undefined)? null : where["status"] = { [Op.eq]: filter.status };
    }
    console.log(where);
    try {
      let articleList = await app.model.Article.findAll({
        where: where,
        include: {
          model: app.model.Comment
        },
        offset: (page.offset-1)*page.limits,
        limit: page.limits,
        order: [
          ['created_at', 'DESC'],
        ]
      })
      return articleList;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getArticleSinglewithComment(id) {
    let { app } = this;
    try {
      let articleSingle = await app.model.Article.findOne({
        where: {
          id: id
        },
        include: {
          model: app.model.Comment
        },
      })
      console.log(articleSingle);
      return articleSingle;
      
    } catch (e) {
      // console.log(e)
      return null;
    }
  }

  async addArticle(data) {
    let { app } = this;
    let { title, cover, content, category, status, author } = data;
    try {
      await app.model.Article.create({
        title,
        cover,
        content,
        category,
        status,
        author
      });
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async delArticle(data) {
    let { app } = this;
    if (typeof(data.id) === "object") {
      console.log("数组"+data.id);
    }else if (typeof(data.id) === "number"){
      console.log("数字"+data.id);
    }
  }
}

module.exports = ArticleService;
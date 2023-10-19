const Service = require('egg').Service;
const { Op } = require("sequelize");

class ArticleService extends Service {
  
  async getArticleAllwithComment(filter,page) {
    let { app, ctx } = this;
    let where = {}
    if (filter) {
      filter = JSON.parse(filter);
      
      (filter.title === undefined)? null : where["title"] = { [Op.like]: `%${filter.title}%` };
      (filter.category === undefined)? null : where["category"] = { [Op.eq]: filter.category };
      (filter.status === undefined)? null : where["status"] = { [Op.eq]: filter.status };
    }
    // console.log(where);
    try {
      let { count, rows } = await app.model.Article.findAndCountAll({
        where: where,
        include: {
          model: app.model.Comment
        },
        offset: (page.offset-1)*page.limits,
        limit: page.limits,
        order: [
          ['created_at', 'DESC'],
        ],
        distinct: true
      })
      return { count, rows };
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
      // console.log(articleSingle);
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

  async deleteArticle(data) {
    let { app } = this;
    let { id } = data;
    let where = {};
    if (typeof(id) === "number") {
      where["id"] = { [Op.eq]: id };
    }
    if (typeof(id) === "object") {
      where["id"] = { [Op.in]: id };
    }
    try {
      await app.model.Article.destroy({
        where: where
      });
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async updateArticle(data) {
    let { app } = this;
    let { updateData, id } = data;
    let where = {
      id: { [Op.eq]: id }
    };

    try {
      await app.model.Article.update(
        updateData,
        {
          where: where
        }
      )
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}

module.exports = ArticleService;
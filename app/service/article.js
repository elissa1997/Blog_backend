const Service = require('egg').Service;

class ArticleService extends Service {
  async getArticleAll(filter,page) {
    let { app } = this;
    let articleList;
    try {
      let {count, rows} = await app.model.Article.findAndCountAll(
        {
          offset: (page.offset-1)*page.limits,
          limit: page.limits,
          order: [
            ['created_at', 'DESC']
          ]
        }
        )
        articleList = {count, rows};
      return articleList;
    } catch (e) {
      return null;
    }
    // console.log("getAll");
  }

  async getArticleSingle(id) {
    let { app } = this;
    let articleSingle;
    try {
      let {dataValues} = await app.model.Article.findOne({
        where: {
          id: id
        }
      })
      articleSingle = dataValues;
      return articleSingle;
      
    } catch (e) {
      // console.log(e)
      return null;
    }
  }
}

module.exports = ArticleService;
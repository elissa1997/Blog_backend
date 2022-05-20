const Service = require('egg').Service;

class ArticleService extends Service {
  async getArticleAll(filter,page) {
    let { app } = this;
    let searchSql = '';
    if (filter) {
      let temp = [];
      filter = JSON.parse(filter);
      (filter.title)? temp.push(`title LIKE '%${filter.title}%'`): undefined;
      (filter.category)? temp.push(`category = '${filter.category}'`): undefined;
      (filter.status)? temp.push(`status = '${filter.status}'`): undefined;

      searchSql = 'WHERE '+temp.join(' AND ');
    }
    // console.log(searchSql);
    const sql = `
    SELECT
      articles.*, 
      COUNT(comments.id) as commentsNum
    FROM
      articles
      LEFT JOIN
      comments
      ON 
        articles.id = comments.a_id
    ${searchSql}
    GROUP BY
      articles.id
    ORDER BY
      articles.created_at DESC
    LIMIT ${(page.offset-1)*page.limits}, ${page.limits}
    `

    let articleList;
    try {
      let rows = await app.model.query(sql, {
        type: 'SELECT', // 查询方式
        raw: false, // 是否使用数组组装的方式展示结果
        logging: false, // 是否将 SQL 语句打印到控制台
      })

      let count = (filter) ? rows.length : await app.model.Article.count();

      articleList = {count, rows};
      return articleList;
    } catch (e) {
      console.log(e);
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

      let commentsNum = await app.model.Comment.count({
        where: {
          a_id: id
        }
      });
      dataValues.commentsNum = commentsNum;
      articleSingle = dataValues;
      // console.log(articleSingle);
      return articleSingle;
      
    } catch (e) {
      // console.log(e)
      return null;
    }
  }
}

module.exports = ArticleService;
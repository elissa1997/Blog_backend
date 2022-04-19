const Service = require('egg').Service;

class CommentService extends Service {

  async getCommentByArticle(a_id) {
    let { app } = this;
    let CommentByArticle;
    try {
      let {count, rows} = await app.model.Comment.findAndCountAll({
        where: {
          a_id: a_id
        },
        order: [
          ['created_at', 'DESC']
        ]
      })

      CommentByArticle = {count, rows};
      return CommentByArticle;
      
    } catch (e) {
      console.log(e)
      return null;
    }
  }
}

module.exports = CommentService;
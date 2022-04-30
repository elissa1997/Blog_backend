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
          ['parent_id', 'ASC'],
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

  async addComment(data) {
    let { app } = this;
    let { aId, parentId, userName, email, url, ip, agent, text } = data;
    // console.log(data);
    // let newComment;
    try {
      await app.model.Comment.create({
        aId,
        parentId,
        userName,
        email,
        url,
        ip,
        agent,
        text
      });
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}

module.exports = CommentService;
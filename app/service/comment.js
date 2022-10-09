const Service = require('egg').Service;

class CommentService extends Service {

  async getCommentAllwithArticle(filter,page) {
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
      let commentList = await app.model.Comment.findAll({
        where: where,
        include: {
          model: app.model.Article
        },
        offset: (page.offset-1)*page.limits,
        limit: page.limits,
        order: [
          ['created_at', 'DESC'],
        ]
      })
      return commentList;
    } catch (e) {
      console.log(e);
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
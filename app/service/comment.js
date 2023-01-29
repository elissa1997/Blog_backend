const Service = require('egg').Service;
const { Op } = require("sequelize");

class CommentService extends Service {

  async getCommentAllwithArticle(filter,page) {
    let { app } = this;
    let where = {}
    if (filter) {
      filter = JSON.parse(filter);
      
      (filter.text === undefined)? null : where["text"] = { [Op.like]: `%${filter.text}%` };
      (filter.aId === undefined)? null : where["aId"] = { [Op.eq]: filter.aId };
      (filter.status === undefined)? null : where["status"] = { [Op.eq]: filter.status };
    }
    console.log(where);
    try {
      let { count, rows } = await app.model.Comment.findAndCountAll({
        where: where,
        include: {
          model: app.model.Article
        },
        offset: page?(page.offset-1)*page.limits:null,
        limit: page?page.limits:null,
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

  async deleteComment(data) {
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
      await app.model.Comment.destroy({
        where: where
      });
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async updateComment(data) {
    let { app } = this;
    let { updateData, id } = data;
    let where = {
      id: { [Op.eq]: id }
    };

    try {
      await app.model.Comment.update(
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

module.exports = CommentService;
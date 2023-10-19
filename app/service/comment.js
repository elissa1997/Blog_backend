const Service = require('egg').Service;
const { Op } = require("sequelize");
const crypto = require('crypto');

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
    // console.log(where);
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
      // console.log(e);
      return null;
    }
  }

  async addComment(data) {
    let { app } = this;
    let { aId, parentId, userName, email, url, ip, agent, text } = data;
    let status = 1;
    // 调用qiniu接口进行内容审核
    let investigate = await this.sendCommentToQiniu(text);
    if (investigate.status = 200) {
      if (investigate.data.result.suggestion == 'pass') {
        try {
          await app.model.Comment.create({
            aId,
            parentId,
            userName,
            email,
            url,
            ip,
            agent,
            text,
            status
          });
          return true;
        } catch (e) {
          console.log(e)
          return false;
        }
      }else{
        console.log("垃圾评论");
        return false;
      }
    }else{
      console.log("七牛云鉴权接口fail");
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

  // 评论发送至七牛内容审核接口
  async sendCommentToQiniu(commentText) {
    const { ctx } = this;
    let host = 'ai.qiniuapi.com';
    let path = '/v3/text/censor';
    let search = '';
    let body = {
      data: {
        text: commentText,
      },
      params: {
        scenes: [
          "antispam"
        ]
      }
    };
    let method = 'POST';
    let token = await this.getQiniuToken(host, path, JSON.stringify(body), method);
    console.log("七牛云鉴权", token);
    const result = await ctx.curl(`https://${host}${path}`, {
      // 必须指定 method
      method: method,
      // 通过 contentType 声明以 JSON 格式发送
      contentType: 'json',
      headers: {
        'Authorization': token,
      },
      data: body,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });

    return result;
  }

  // 七牛生成鉴权接口
  async getQiniuToken(host, path, body,method) {

    let access = undefined;
    access = method.toUpperCase() + ' ' + path;
    access += '\nHost: ' + host;
    access += '\nContent-Type: application/json';
    access += '\n\n';
    access += body;
    console.log("待签名字符串", access)
    let hmac = crypto.createHmac('sha1', this.config.qiniu.secretKey);
    hmac.update(access);
    let digest = hmac.digest('base64');

 
    let safeDigest = digest.replace(/\//g, '_').replace(/\+/g, '-');
    return 'Qiniu ' + this.config.qiniu.accessKey + ':' + safeDigest;
  }
}

module.exports = CommentService;
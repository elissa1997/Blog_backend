module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Comment = app.model.define('comment', {
    id: {                     // 主键ID
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    aId: INTEGER,      // 文章id
    parentId: INTEGER, // 父评论id
    isRegist: INTEGER, // 是否是管理员发表的评论
    userName: STRING,  // 用户名
    email: STRING,     // 邮箱
    url: STRING,       // 网址
    ip: STRING,        // ip
    agent: STRING,     // 用户代理
    text: TEXT,        // 评论内容
  })

  Comment.associate = function (){
    app.model.Comment.belongsTo(app.model.Article, {foreignKey: 'aId', targetKey: 'id'});
  }

  return Comment;
}
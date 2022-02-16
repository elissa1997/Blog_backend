 module.exports = app => {
   const {STRING,INTEGER,TEXT} = app.Sequelize;

   const Article = app.model.define('article',{
     title: STRING,           // 标题
     cover: STRING,           // 封面url
     content: TEXT('long'),   // 内容
     category: INTEGER,       // 分类
     status: STRING,          // 关联
     author: INTEGER,         // 作者
   })

   return Article;
 }
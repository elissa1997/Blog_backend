 module.exports = app => {
   const {STRING,INTEGER,TEXT} = app.Sequelize;

   const Article = app.model.define('article',{
    id: {                     // 主键ID
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
     title: STRING,           // 标题
     cover: STRING,           // 封面url
     content: TEXT('long'),   // 内容
     category: INTEGER,       // 分类
     status: INTEGER          // 状态

   })

   Article.associate = function (){
    app.model.Article.hasMany(app.model.Comment, {foreignKey: 'aId', targetKey: 'id'});
   }

   return Article;
 }
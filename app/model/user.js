 module.exports = app => {
   const {STRING,INTEGER} = app.Sequelize;

   const User = app.model.define('user',{
     name: STRING,
     password: STRING,
     email: STRING,
     admin: INTEGER
   })

   return User;
 }
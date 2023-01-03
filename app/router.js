'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/test', app.middleware.checkToken(), controller.test.getMsg);

  router.post('/register', controller.user.register);
  router.post('/login', controller.user.login);

  router.get('/article/list', controller.article.listArticle);
  router.get('/article/detail', controller.article.detailArticle);
  router.post('/article/add', app.middleware.checkToken(), controller.article.addArticle);
  router.post('/article/del', app.middleware.checkToken(), controller.article.delArticle);
  
  router.get('/comment/list', controller.comment.listComment);
  router.post('/comment/add', controller.comment.addComment);
  router.post('/comment/update', app.middleware.checkToken(), controller.comment.updateComment);
  router.post('/comment/del', app.middleware.checkToken(), controller.comment.deleteComment);
};

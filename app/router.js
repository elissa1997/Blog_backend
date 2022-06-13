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

  router.get('/article/list', controller.article.getList);
  router.get('/article/detail', controller.article.getDetail);
  router.post('/article/add', app.middleware.checkToken(), controller.article.addArticle);

  router.get('/comment/listbyarticle', controller.comment.getListByArticle);
  router.post('/comment/add', controller.comment.addComment);

};

/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1626948244214_6839';

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }
  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    database: 'blog',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: 'liuxingyu',
    timezone: '+08:00'
  }

  // add your middleware config here
  config.middleware = [];

  // 安全设置
  config.security = {
    csrf: {
      enable: false
    }
  };

  // jwt设置
  config.jwt = {
    secret: 'makedream'
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

checkToken = () => {
  return async (ctx, next) => {
    try {
      // 1.Get token
      let token = ctx.request.header.token;
      // 2.Verify token
      console.log(ctx.app.jwt.verify(token, ctx.app.config.jwt.secret));
      let decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      if(decode.data.name && decode.data.password) {
        await next();
      } else {
        ctx.body = {
          msg: 'Jwt verification failed',
          status: 400
        }
      }
    } catch (e) {
      ctx.body = {
        msg: 'Jwt verification failed',
        status: 501
      }
    }
  }
}

module.exports = checkToken;
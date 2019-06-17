const Koa = require("koa");
const app = new Koa();

const Pug = require("koa-pug");
const pug = new Pug({
  viewPath: "./server/views/pages",
  debug: false,
  pretty: false,
  compileDebug: false,
  app: app
});

const static = require("koa-static");
app.use(static("./server/static"));

const session = require("koa-session");
app.use(
  session(
    {
      key: "koa:sess",
      maxAge: "session",
      overwrite: true,
      httpOnly: true,
      signed: false,
      rolling: false,
      renew: false
    },
    app
  )
);

const koaBody = require("koa-body");
app.use(
  koaBody({
    formidable: {
      uploadDir: "./server/static/assets/img/products/"
    },
    multipart: true
  })
);

const router = require("./server/router");
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});

const Router = require("koa-router");
const router = new Router();

let productsCtrl = require("../controllers/products");
let countersCtrl = require("../controllers/counters");
let authCtrl = require("../controllers/auth");
let mailCtrl = require("../controllers/mail");

router.get("/", async ctx => {
  try {
    let products = await productsCtrl.get();
    let skills = await countersCtrl.get();

    ctx.render("index", {
      products,
      skills
    });
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 404;
  }
});

router.post("/", async ctx => {
  try {
    await mailCtrl.send(ctx.request.body);

    let products = await productsCtrl.get();
    let skills = await countersCtrl.get();

    ctx.render("index", {
      products,
      skills
    });
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 500;
  }
});

router.get("/login", async ctx => {
  try {
    ctx.render("login");
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 500;
  }
});

router.post("/login", async ctx => {
  try {
    await authCtrl.auth(ctx.request.body);
    ctx.session.isAuth = true;

    ctx.render("admin");
  } catch (err) {
    console.error("err", err);
    ctx.redirect("/login");
    ctx.status = err.status || 500;
  }
});

router.get("/admin", async ctx => {
  try {
    if (ctx.session.isAuth) {
      ctx.render("admin");
    } else {
      ctx.redirect("/login");
    }
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 404;
  }
});

router.post("/admin/upload", async ctx => {
  try {
    await productsCtrl.add({ ...ctx.request.files, ...ctx.request.body });

    ctx.render("admin");
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 500;
  }
});

router.post("/admin/skills", async ctx => {
  try {
    await countersCtrl.set({ ...ctx.request.body });

    ctx.render("admin");
  } catch (err) {
    console.error("err", err);
    ctx.status = err.status || 500;
  }
});

module.exports = router;

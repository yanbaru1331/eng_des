// import { serve } from "@hono/node-server";
// import { Hono } from "hono";
// import { validator } from "hono/validator";
// import { cors } from 'hono/cors'

// const app = new Hono();


// //honoでcrosをlocalhost:3001に許可するようなコード
// app.use(cors({
// 	origin: ['http://localhost:3001'],
// 	allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'], // ここに追加
// 	allowMethods: ['POST', 'GET', 'OPTIONS'],
// 	exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
// 	maxAge: 600,
// 	credentials: true,
// }))



// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

// // app.get post putをおいて('urlパス, (c) => {処理の内容})
// app.get("/hoge/huga", async (c) => {
//   return c.text("poyp~");
// });
// const port = 3000;
// console.log(`Server is running on port ${port}`);

// app.post(
//   "/login",
//   validator("json", (value, c) => {
//     //受け付けた引数が正しい型、存在するかを確認するコード
//     const user = value["user"];
//     const pass = value["password"];
//     if (
//       !user ||
//       typeof user !== "string" ||
//       !pass ||
//       typeof pass !== "string"
//     ) {
//       return c.text("Invalid!", 400);
//     }
//     return { user, pass };
//   }),
//   async function (c) {
//     const { user, pass } = c.req.valid("json");
//     //最終的にdbとくっつける
//     if (user === "admin" && pass === "admin") {
//       return c.json({ result: "ok" });
//     } else {
//       return c.json({ result: "passNg" }, 400);
//     }
//   }
// );

// app.get("/test-cors", (c) => {
// 	return c.json({ message: "CORS is working!" });
//   });
  
// // //honoでcrosをlocalhost:3001に許可するようなコード
// // app.use(cors({
// // 	origin: ['http://localhost:3001'],
// // 	allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'], // ここに追加
// // 	allowMethods: ['POST', 'GET', 'OPTIONS'],
// // 	exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
// // 	maxAge: 600,
// // 	credentials: true,
// // }))





// // app.use('/*', cors()
// // 	// cors({
// // 	// 	origin: ['http://localhost:3001/*'],
// // 	// 	allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'], // ここに追加
// // 	// 	allowMethods: ['POST', 'GET', 'OPTIONS'],
// // 	// 	exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
// // 	// 	maxAge: 600,
// // 	// 	credentials: true,
// // 	// })
// // )
// serve({
//   fetch: app.fetch,
//   port,
// });

// // async->非同期の通信 dbとかを触れる可能性があるならいれる

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { cors } from 'hono/cors';

const app = new Hono();

// CORSミドルウェアの設定
app.use('*', cors({
  origin: ["http://localhost:3001"],
//   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
  allowHeaders: ['*'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hoge/huga", async (c) => {
  return c.text("poyp~");
});

app.get("/test-cors", (c) => {
  return c.json({ message: "CORS is working!" });
});

app.post(
  "/login",
  validator("json", (value, c) => {
    const user = value["user"];
    const pass = value["password"];
    if (!user || typeof user !== "string" || !pass || typeof pass !== "string") {
      return c.text("Invalid!", 400);
    }
    return { user, pass };
  }),
  async function (c) {
    const { user, pass } = c.req.valid("json");
    if (user === "admin" && pass === "admin") {
      return c.json({ result: "ok" });
    } else {
      return c.json({ result: "passNg" }, 400);
    }
  }
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

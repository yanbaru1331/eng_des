
// // async->非同期の通信 dbとかを触れる可能性があるならいれる
// 型定義はちゃん書いておく
// 要相談だけど、/api/~みたいにかいたほうがいいかも
// 今は/でおいてるけど割と構築がしにくくなってきた

// ↑解決したよ/api/user/createみたいな感じのURLだよ
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from 'hono/cors';
import { validator } from "hono/validator";

// /api/のルーティング
import { apiApp } from "./endpoint/api_route";
const app = new Hono()
  .route('/api', apiApp)

// front に型情報を送る（hono
export type AppType = typeof app

// CORSミドルウェアの設定nn
app.use('/*', cors({
  origin: "http://localhost:8000",
  //オリジンの設定がうまく言ってないのでとりあえず*で動かす
  // origin: "*",
  //   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
  allowHeaders: ['*'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

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


// // async->非同期の通信 dbとかを触れる可能性があるならいれる
// 型定義はちゃん書いておく

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from 'hono/cors';
import { validator } from "hono/validator";

import { PrismaClient } from "@prisma/client";
import { createUser, deleteUser, getUser, updateUser } from "./db_operations/user";

const prisma = new PrismaClient();

const app = new Hono();

// CORSミドルウェアの設定
app.use('/*', cors({
  // origin: "http://front:3001",
  //オリジンの設定がうまく言ってないのでとりあえず*で動かす
  origin: "*",
  //   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
  allowHeaders: ['*'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

app.get("/", (c) => {
  return c.text("Hello Hono!");

  //db操作するコード
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

app.get('/test', async (c) => {
  try {
    console.log('--- Running Test ---');
    await test();
    return c.text('Test executed successfully');
  } catch (error) {
    console.error('Error executing test:', error);
    return c.text('Error executing test');
  }
});

async function test() {
  try {
    console.log('--- Creating User ---');
    const newUser = await createUser({
      username: 'testuser',
      password: 'password123',
      email: 'testuser@example.com',
      last_login: new Date(),
    });
    console.log('Created User:', newUser);

    console.log('--- Getting User ---');
    const fetchedUser = await getUser(newUser.id);
    console.log('Fetched User:', fetchedUser);

    console.log('--- Updating User ---');
    const updatedUser = await updateUser(newUser.id, {
      email: 'newemail@example.com',
    });
    console.log('Updated User:', updatedUser);

    console.log('--- Deleting User ---');
    const deletedUser = await deleteUser(newUser.id);
    console.log('Deleted User:', deletedUser);

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

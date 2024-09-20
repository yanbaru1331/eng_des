// /api/user/ 以下のapiだよ
// 型チェックの object を参照して json を渡してね

import { Hono } from "hono";
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { createUser, deleteUser, getUserByEmail, getUserByUsername, updateUser } from '../db_operations/user';

export const userApp = new Hono();

// CORSミドルウェアの設定nn
userApp.use('/*', cors({
    origin: "http://localhost:8000",
    //オリジンの設定がうまく言ってないのでとりあえず*で動かす
    // origin: "*",
    //   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
    allowHeaders: ['*'],
    allowMethods: ['POST', 'GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
}));

// create用の型チェック
const createSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    date_of_birth: z.string().date().optional().refine(val => val === "" || !!val, {
        message: "Invalid date_of_birth format"
    })// "YYYY-MM-DD"のstring
});

// POSET /api/user
// user 作成
userApp.post(
    '/',
    zValidator('json', createSchema),
    async (c) => {
        // バリデーションが通ったJSONデータを取得
        const { username, email, password, date_of_birth } = await c.req.valid("json");


        // パスワードをハッシュ化（ここではbcryptを使用してsaltRoundsを10に設定）
        const hashedPassword = await bcrypt.hash(password, 10);

        // email, usernameが既存か確認
        const exsisting_email = await getUserByEmail(email);
        const exsisting_username = await getUserByUsername(username);


        if (exsisting_email && exsisting_username) {
            console.error('error: This email and username is already existed');
            return c.json({ error: 'This email and username is already existed' }, 500);
        }
        else if (exsisting_email) {
            console.error('error: This email is already existed');
            return c.json({ error: 'This email is already existed' }, 500);
        }
        else if (exsisting_username) {
            console.error('error: This username is already existed');
            return c.json({ error: 'This username is already existed' }, 500);
        };

        // 誕生日をISO YYYY-MN-DDのstringに変換
        if (date_of_birth) {
            new Date(date_of_birth).toISOString();
        };

        // Prisma UserCreateInput型に合わせる
        const userData = {
            username: username,
            email: email,
            password: hashedPassword, // ハッシュ化されたパスワードを使用
            date_of_birth: date_of_birth
        };

        try {
            // ユーザーデータをデータベースに登録
            const newUser = await createUser(userData);
            // 登録成功時のレスポンス
            return c.json({ message: 'User created successfully', userId: newUser.id }, 201);
        } catch (error) {
            console.error('Error creating user:', error);
            // エラーレスポンス
            return c.json({ error: 'Failed to create User' }, 500);
        }
    }
);

async function checkUserExisting(email: string, username: string) {

}

// login用の型チェック
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// POST /api/user/login
userApp.post(
    'login',
    zValidator('json', loginSchema),
    async (c) => {
        const { email, password } = await c.req.valid("json");

        try {
            // データベースからユーザー情報を取得
            const user = await getUserByEmail(email);

            if (!user) {
                // ユーザーが見つからない場合
                return c.json({ error: 'User not found' }, 404);
            }

            // データベースに保存されているハッシュとパスワードを比較
            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                // パスワードが一致した場合
                await updateUser(user.id, user.email, user.username);
                return c.json({ message: 'Login successful', userId: user.id, email: user.email, userName: user.username }, 200);
            } else {
                // パスワードが一致しない場合
                return c.json({ error: 'Invalid password' }, 401);
            }
        } catch (error) {
            console.error('Error during login:', error);
            // 例外が発生した場合のエラーレスポンス
            return c.json({ error: 'Login failed' }, 500);
        }
    }
);

// delete用の型チェック
const deleteSchema = z.object({
    email: z.string().email()
});

// DELETE /api/user
userApp.delete(
    '/',
    zValidator('json', deleteSchema),
    async (c) => {
        const { email } = await c.req.valid("json");  // リクエストからIDを取得

        try {
            const deletedUser = await deleteUser(email);  // deleteUser関数を呼び出してユーザーを削除
            return c.json({ message: 'User deleted successfully', userId: deletedUser.id }, 200);  // 削除成功時のレスポンス
        } catch (error) {
            console.error('Error deleting user:', error);
            return c.json({ error: 'Failed to delete user' }, 500);  // エラー発生時のレスポンス
        }
    }
);

// 後で書く
// userApp.get('update', async c => {
//     return c.text('hello userApp update')
// })

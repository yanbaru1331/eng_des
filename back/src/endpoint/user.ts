// /api/user/ 以下のapiだよ
// 型チェックの object を参照して json を渡してね

import { Hono } from "hono";

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import bcrypt from 'bcrypt';

import { createUser, getUser, deleteUser} from '../db_operations/user';

export const userApp = new Hono();

// create用の型チェック
const createSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});

// /api/user/create
userApp.post(
    'create',
    zValidator('json', createSchema),
    async (c) => {
        // バリデーションが通ったJSONデータを取得
        const { username, email, password } = await c.req.valid ("json");

        // パスワードをハッシュ化（ここではbcryptを使用してsaltRoundsを10に設定）
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prisma UserCreateInput型に合わせる
        const userData = {
            username: username,
            email: email,
            password: hashedPassword // ハッシュ化されたパスワードを使用
        };

        try {
            // ユーザーデータをデータベースに登録
            const newUser = await createUser(userData);
            // 登録成功時のレスポンス
            return c.json({ message: 'User created successfully', userId: newUser.id }, 201);
        } catch (error) {
            console.error('Error creating user:', error);
            // エラーレスポンス
            return c.json({ error: 'Failed to create USer' }, 500);
        }
    }
);

// login用の型チェック
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// /api/user/login
userApp.post(
    'login',
    zValidator('json', loginSchema),
    async (c) => {
        const { email, password } = await c.req.valid ("json");

        try {
            // データベースからユーザー情報を取得
            const user = await getUser(email);

            if (!user) {
                // ユーザーが見つからない場合
                return c.json({ error: 'User not found' }, 404);
            }

            // データベースに保存されているハッシュとパスワードを比較
            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                // パスワードが一致した場合
                return c.json({ message: 'Login successful', userId: user.id, email: user.email }, 200);
            } else {
                // パスワードが一致しない場合
                return c.json({ error: 'Invalid password' }, 401);
            }
        } catch (error) {
            console.error('Error during login:', error);
            // 例外が発生した場合のエラーレスポンス
            return c.json({ error: 'Login failed' }, 500);
        }
})

// delete用の型チェック
const deleteSchema = z.object({
    email: z.string().email()
});

// /api/user/delete
userApp.post(
    'delete',
    zValidator('json', deleteSchema),
    async (c) => {
        const { email } = await c.req.valid ("json");  // リクエストからIDを取得

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

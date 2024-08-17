// /api/portfilio/page 以下のapi
// 型チェックの object を参照して json を渡す

import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { createPortfolioPage, deletePortfolioPage, getPortfolioPage } from '../db_operations/portfolio_page';

export const PortfolioPageApp = new Hono();

const createPortfolioPageSchema = z.object({
    user_id: z.number(),
    contact_address: z.string().optional(),
    published: z.boolean().optional(),
    max_item: z.number().optional(),
    max_depth: z.number().optional(),
    max_score: z.number().optional()
});

PortfolioPageApp.post(
    '/',
    zValidator('json', createPortfolioPageSchema),
    async (c) => {
        // バリデーションが通ったデータを取得
        const { user_id, contact_address, published, max_item, max_depth, max_score } = await c.req.valid("json");

        const pageData = {
            user: {
                connect: {
                    id: user_id
                }
            },
            contact_address: contact_address,
            published: published,
            max_item: max_item,
            max_depth: max_depth,
            max_score: max_score
        }

        try {
            // データベースに新しいポートフォリオページを作成
            const newPortfolioPage = await createPortfolioPage(pageData)
            // 成功レスポンスを返す
            return c.json({ message: 'Portfolio page created successfully', portfolioPage: newPortfolioPage }, 201);
        } catch (error) {
            console.error('Error creating portfolio page:', error);
            // エラーレスポンスを返す
            return c.json({ error: 'Failed to create portfolio page' }, 500);
        }
    }
);

const deletePortfolioPageSchema = z.object(
    {
        user_id: z.number()
    }
);

PortfolioPageApp.delete(
    '/',
    zValidator('json', deletePortfolioPageSchema),
    async (c) => {
        const { user_id } = await c.req.valid("json");  // リクエストからIDを取得

        try {
            const deletedPortfolioPage = await deletePortfolioPage(user_id);  // deleteUser関数を呼び出してユーザーを削除
            return c.json({ message: 'PortfolioPage deleted successfully', UserId: user_id, PortfolioPageId: deletedPortfolioPage.id }, 200);  // 削除成功時のレスポンス
        } catch (error) {
            console.error('Error deleting PortfolioPage:', error);
            return c.json({ error: 'Failed to delete PortfolioPage' }, 500);  // エラー発生時のレスポンス
        }
    }
);

const getPortfolioPageSchema = z.object({
    user_id: z.string().regex(/^\d+$/),  // クエリパラメータは文字列として受け取る
});

PortfolioPageApp.get(
    '/',
    zValidator('query', getPortfolioPageSchema),  // クエリパラメータをバリデート
    async (c) => {
        try {
            const { user_id } = c.req.valid('query');
            const portfolioPage = await getPortfolioPage(parseInt(user_id, 10));  // user_idを数値に変換

            if (portfolioPage) {
                return c.json(portfolioPage);
            } else {
                return c.json({ message: 'Portfolio page not found' }, 404);
            }
        } catch (error) {
            console.error('Error get portfoliopage:', error);
            return c.json({ error: 'Failed to get portfoliopage' }, 500);
        }
    }
);

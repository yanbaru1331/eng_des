// /api/portfilio/page 以下のapi
// 型チェックの object を参照して json を渡す

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

import { createPortfolioPage, deletePortfolioPage, getPortfolioPage, getScoreStandards } from '../db_operations/portfolio_page';
import { getUserByUsername } from '../db_operations/user';

export const PortfolioPageApp = new Hono();

// CORSミドルウェアの設定nn
PortfolioPageApp.use('/*', cors({
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
const createPortfolioPageSchema = z.object({
    user_id: z.number(),
    contact_address: z.string().optional(),
    published: z.boolean().optional(),
    max_item: z.number().optional(),
    max_depth: z.number().optional(),
    max_score: z.number().optional(),
    score_standards: z.array(z.string())
});

PortfolioPageApp.post(
    '/',
    zValidator('json', createPortfolioPageSchema),
    async (c) => {
        // バリデーションが通ったデータを取得
        const { user_id, contact_address, published, max_item, max_depth, max_score, score_standards } = await c.req.valid("json");

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
        const scoreStandards = score_standards;

        try {
            // データベースに新しいポートフォリオページを作成
            const newPortfolioPage = await createPortfolioPage(pageData, scoreStandards);

            // 成功レスポンスを返す
            return c.json({ portfolio_page: newPortfolioPage }, 201);
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
            return c.json({ user_id: user_id, portfolio_page_id: deletedPortfolioPage.id }, 200);  // 削除成功時のレスポンス
        } catch (error) {
            console.error('Error deleting PortfolioPage:', error);
            return c.json({ error: 'Failed to delete PortfolioPage' }, 500);  // エラー発生時のレスポンス
        }
    }
);

const getScoreStandardSchema = z.object(
    {
        user_id: z.string().regex(/^\d+$/)
    }
)
PortfolioPageApp.get(
    '/score_standard',
    zValidator('query', getScoreStandardSchema),
    async (c) => {
        const { user_id } = await c.req.valid("query");

        try {
            const page = await getPortfolioPage(Number(user_id));
            if (page) {
                const scoreStandards = await getScoreStandards(page.id);
                if (!scoreStandards) {
                    console.error('scoreStandards is not existing', page);
                    return c.json({ error: 'scorstandards is not existing ', get_portfolio_page: page }, 400);
                }

                const scoreStandardsArray: String[] = scoreStandards.map((item) => item.standard);

                return c.json({ data: scoreStandardsArray }, 200);
            } else {
                console.error('portfoliopage is not existing');
                return c.json({ error: 'portfoliopage is not existing ' }, 400);
            }
        } catch (error) {
            console.error('Error fetchng score standards', error);
            return c.json({ error: 'Failed to fetchng score standards' }, 500);
        }
    }
)

const getPortfolioPageSchema = z.object({
    user_id: z.string().regex(/^\d+$/).optional(),  // クエリパラメータは文字列として受け取る or
    user_name: z.string().optional()  // クエリパラメータは文字列として受け取る
});

type Merge<T extends object, U extends object> = {
    [K in keyof (T & U)]: (T & U)[K];
};

PortfolioPageApp.get(
    '/',
    zValidator('query', getPortfolioPageSchema),  // クエリパラメータをバリデート
    async (c) => {
        try {
            const { user_name, user_id } = c.req.valid('query');

            let userId: number | undefined;

            if (user_name) {
                const userData = await getUserByUsername(user_name);
                userId = userData?.id;
            } else if (user_id) {
                userId = parseInt(user_id, 10);
            }

            if (userId) {
                const portfolioPage = await getPortfolioPage(userId);
                if (portfolioPage) {
                    const scoreStandards = await getScoreStandards(portfolioPage.id);
                    const scoreStandardsArray: String[] = scoreStandards.map((item) => item.standard);
                    type returnScoreStandards = {
                        score_standards: String[];
                    }
                    const returnScoreStandardsData: returnScoreStandards = {
                        score_standards: scoreStandardsArray
                    };
                    const returnData = { ...portfolioPage, ...returnScoreStandardsData };
                    return c.json({ data: returnData }, 200);
                } else {
                    return c.json({ error: 'Portfolio page not found' }, 404);
                }
            } else {
                return c.json({ error: "User is not found" }, 404);
            }
        } catch (error) {
            console.error('Error get portfoliopage:', error);
            return c.json({ error: 'Failed to get portfoliopage' }, 500);
        }
    }
);

import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { cors } from 'hono/cors';
import { z } from 'zod';

import { getAllPortfolioRaderChartLeaves, getPortfolioRaderChartLeaveByChartId } from "../db_operations/portfolio_leaves";
import { getPortfolioPage } from '../db_operations/portfolio_page';
import { createPortfolioRaderChartsData, getPortfolioRaderChart, getPortfolioRaderChartByChartId, updatePortfolioRaderChartsData } from '../db_operations/portfolio_rader_chart';
import { getAllPortfolioRaderChartRelations, getPortfolioRaderChartRelationsByChartId, getPortfolioRaderChartRelationsByParent } from "../db_operations/portfolio_rader_chart_relation";
export const PortfolioChartApp = new Hono();

// CORSミドルウェアの設定nn
PortfolioChartApp.use('/*', cors({
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


type LeaveWithItemNum = {
    id: number;
    name: string;
    score: number;
    chart_id: number;
    page_id: number;
    created_at: Date;
    updated_at: Date;
    item_num: number;
};


const createPortfolioRaderChartsSchema = z.object({
    user_id: z.number(),
    charts: z.array(
        z.object({
            name: z.string()
        })
    ),
    relations: z.array(
        z.object({
            parent_index: z.number(),
            child_index: z.number(),
            depth: z.number()
        })
    ),
    leaves: z.array(
        z.object({
            name: z.string(),
            score: z.number(),
            chart_index: z.number()
        })
    )
});

PortfolioChartApp.post(
    '/',
    zValidator('json', createPortfolioRaderChartsSchema),
    async (c) => {
        const { user_id, charts, relations, leaves } = await c.req.valid('json');

        try {
            const portfolioPageData = await getPortfolioPage(user_id);
            if (portfolioPageData == null) {
                return c.json({ message: 'Portfolio page is not existed' }, 400);
            }
            const portfolioChartData = await getPortfolioRaderChart(portfolioPageData.id);
            // idが含まれていない作成 && すでに page に紐づく chart が存在している場合は拒否
            if (portfolioChartData.length) {
                return c.json({ message: 'Charts data is existed' }, 400);
            }

            // 1. チャートのデータを整形
            const portfolioChartsData = charts.map(chart => ({
                name: chart.name,
                pageId: portfolioPageData.id, // 既存のポートフォリオページのIDを使用
            }));

            // 2. リレーションのデータを整形
            const portfolioRelationsData = relations.map(relation => ({
                pageId: portfolioPageData.id,
                parentId: relation.parent_index,
                childId: relation.child_index,
                depth: relation.depth
            }));

            // 3. リーフのデータを整形
            const portfolioLeavesData = leaves.map(leave => ({
                page_id: portfolioPageData.id,
                name: leave.name,
                score: leave.score,
                chartIndex: leave.chart_index
            }));

            // 4. トランザクション内でデータを更新
            const result = await createPortfolioRaderChartsData(portfolioChartsData, portfolioRelationsData, portfolioLeavesData);

            return c.json({ data: result }, 200);

        } catch (error) {
            console.error('Error processing request:', error);
            return c.json({ message: 'Internal server error' }, 500);
        }
    }
);
const updatePortfolioRaderChartsSchema = z.object({
    user_id: z.number(),
    charts: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            page_id: z.number(),
            created_at: z.string().optional(),
            updated_at: z.string().optional()
        })
    ),
    relations: z.array(
        z.object({
            id: z.number(),
            page_id: z.number(),
            parent_id: z.number(),
            child_id: z.number(),
            depth: z.number(),
            created_at: z.string().optional(),
            updated_at: z.string().optional()
        })
    ),
    leaves: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            score: z.number(),
            chart_id: z.number(),
            page_id: z.number(),
            created_at: z.string().optional(),
            updated_at: z.string().optional(),
            item_num: z.number().optional()
        })
    )
});
PortfolioChartApp.put(
    '/',
    zValidator('json', updatePortfolioRaderChartsSchema),
    async (c) => {
        const { user_id, charts, relations, leaves } = await c.req.valid('json');

        try {

            // 1. チャートのデータを整形
            const portfolioChartsData = charts.map(chart => ({
                id: chart.id, // 更新のためにIDを含める
                pageId: chart.id,
                name: chart.name

            }));

            // 2. リレーションのデータを整形
            const portfolioRelationsData = relations.map(relation => ({
                id: relation.id, // 更新のためにIDを含める
                pageId: relation.id,
                parentId: relation.parent_id,
                childId: relation.child_id,
                depth: relation.depth
            }));

            // 3. リーフのデータを整形
            const portfolioLeavesData = leaves.map(leave => ({
                id: leave.id, // 更新のためにIDを含める
                pageId: leave.id,
                name: leave.name,
                score: leave.score,
                chartId: leave.chart_id
            }));

            console.log(portfolioChartsData);
            console.log(portfolioRelationsData);
            console.log(portfolioLeavesData);

            // 4. トランザクション内でデータを更新
            const result = await updatePortfolioRaderChartsData(portfolioChartsData, portfolioRelationsData, portfolioLeavesData);

            return c.json({ data: result }, 200);

        } catch (error) {
            console.error('Error processing request:', error);
            return c.json({ message: 'Internal server error' }, 500);
        }
    }
);

const getAllPortfolioRaderChartsSchema = z.object({
    user_id: z.string().regex(/^\d+$/),  // クエリパラメータは文字列として受け取る
});

PortfolioChartApp.get(
    '/all_update_format',
    zValidator('query', getAllPortfolioRaderChartsSchema),
    async (c) => {
        try {
            const { user_id } = c.req.valid('query');

            const portfolioPageData = await getPortfolioPage(parseInt(user_id, 10));

            if (portfolioPageData == null) {
                return c.json({ message: 'Portfolio page is not existed' }, 400);
            }

            const portfolioRaderCharts = await getPortfolioRaderChart(portfolioPageData.id);
            const portfolioRaderChartsRelations = await getAllPortfolioRaderChartRelations(portfolioPageData.id);
            const portfolioRaderChartsLeaves = await getAllPortfolioRaderChartLeaves(portfolioPageData.id);



            let updatedLeaves: LeaveWithItemNum[] = [];
            portfolioRaderCharts.forEach(chart => {
                const sameTargetChartLeave = portfolioRaderChartsLeaves.filter((leave) =>
                    leave.chart_id == chart.id
                );

                let i = 0;
                sameTargetChartLeave.forEach(leave => {
                    const updatedLeave: LeaveWithItemNum = { ...leave, item_num: i };
                    updatedLeaves.push(updatedLeave)
                    i++;
                });
            });
            console.log(portfolioRaderChartsLeaves);
            const data = {
                pages: portfolioPageData,
                charts: portfolioRaderCharts,
                relations: portfolioRaderChartsRelations,
                leaves: updatedLeaves,
            }

            return c.json({ data: data }, 200);
        } catch (error) {
            console.error('Error processing request', error);
            return c.json({ message: 'Internal server error' });
        }
    }
);

const getUnderPortfolioRaderChartsSchema = z.object({
    chart_id: z.string().regex(/^\d+$/),  // クエリパラメータは文字列として受け取る
});

PortfolioChartApp.get(
    '/children',
    zValidator('query', getUnderPortfolioRaderChartsSchema),
    async (c) => {
        try {
            const { chart_id } = c.req.valid('query');
            const chartId = parseInt(chart_id)
            const chartChildrenRelation = await getPortfolioRaderChartRelationsByParent(chartId);
            if (chartChildrenRelation == null) {
                return c.json({ message: 'Portfolio chart is not existed' }, 400);
            };

            const charts = [];
            const leaves = [];
            for (const chartrelation of chartChildrenRelation) {
                const chart = await getPortfolioRaderChartByChartId(chartrelation.child_id);
                charts.push(chart);
                const leave = await getPortfolioRaderChartLeaveByChartId(chartrelation.child_id);
                leaves.push(leave);
            }

            const targetChartRelation = await getPortfolioRaderChartRelationsByChartId(chartId);

            const data = {
                chart_id: chart_id,
                charts: charts,
                leaves: leaves,
                relations: targetChartRelation
            }
            return c.json({ data: data }, 200);
        } catch (error) {
            console.error('Error processing request', error);
            return c.json({ message: 'Internal server error' });
        }
    }
)


var sum = function (arr: number[]) {
    return arr.reduce(function (prev, current, i, arr) {
        return prev + current;
    });
};

PortfolioChartApp.get(
    '/all_view_format',
    zValidator('query', getAllPortfolioRaderChartsSchema),
    async (c) => {
        try {
            const { user_id } = c.req.valid('query');

            const portfolioPageData = await getPortfolioPage(parseInt(user_id, 10));

            if (portfolioPageData == null) {
                return c.json({ message: 'Portfolio page is not existed' }, 404);
            }


            const portfolioRaderCharts = await getPortfolioRaderChart(portfolioPageData.id);
            const portfolioRaderChartsRelations = await getAllPortfolioRaderChartRelations(portfolioPageData.id);
            const portfolioRaderChartsLeaves = await getAllPortfolioRaderChartLeaves(portfolioPageData.id);


            const returnChartsData: { id: number; title: string; label: string[]; children_id: number[]; depth: number; created_at: Date; update_at: Date; children_scores: (number | undefined)[]; children_score_average: number | undefined; }[] = [];

            const bottomChartId: number[] = [];
            portfolioRaderChartsLeaves.forEach(leaves => {
                const bottomChart = portfolioRaderCharts.filter((chart) =>
                    chart.id == leaves.chart_id
                )[0]
                bottomChartId.push(bottomChart.id);
            })

            portfolioRaderCharts.forEach(portfolioRaderChart => {

                const targetRelation = portfolioRaderChartsRelations.filter((relation) =>
                    relation.parent_id == portfolioRaderChart.id &&
                    relation.parent_id == relation.child_id
                )[0]

                let targetDepth = targetRelation.depth + 1;

                // id のdepthを取得してそれに1足したものでchildを探す
                const childrenChartRelations = portfolioRaderChartsRelations.filter((relation) =>
                    relation.parent_id == portfolioRaderChart.id &&
                    relation.depth == targetDepth
                )
                const childrenId = childrenChartRelations.map(relation => relation.child_id)

                let childrenLabels: string[] = [];
                let childrenScores: number[] = [];
                let childrenScoreAverage: number | undefined;

                if (bottomChartId.includes(portfolioRaderChart.id)) {
                    const targetLeaves = portfolioRaderChartsLeaves.filter((leave) =>
                        leave.chart_id === portfolioRaderChart.id
                    );
                    childrenLabels = targetLeaves.map(leave => leave.name);
                    childrenScores = targetLeaves.map(leave => leave.score);
                    childrenScoreAverage = sum(childrenScores) / childrenScores.length;

                } else {
                    childrenId.forEach(childId => {
                        const childrenChart = portfolioRaderCharts.find((chart) =>
                            chart.id == childId
                        );
                        if (childrenChart) {
                            childrenLabels.push(childrenChart.name);
                        }
                    });
                }

                const returnChartData = {
                    id: portfolioRaderChart.id,
                    title: portfolioRaderChart.name,
                    label: childrenLabels,
                    children_id: childrenId,
                    depth: targetDepth - 1,
                    children_scores: childrenScores,
                    children_score_average: childrenScoreAverage,
                    created_at: portfolioRaderChart.created_at,
                    update_at: portfolioRaderChart.updated_at
                };
                returnChartsData.push(returnChartData);
            });
            returnChartsData
                .sort((a, b) => {
                    if (b.depth !== a.depth) {
                        return b.depth - a.depth; // depth の降順
                    } else {
                        return b.id - a.id; // depth が同じ場合は id の昇順
                    }
                }) // 降順にソート
                .forEach(returnchart => {
                    if (!bottomChartId.includes(returnchart.id)) {
                        returnchart.children_id.forEach(childId => {
                            const childChart = returnChartsData.filter((chart) =>
                                chart.id == childId
                            );
                            const childchildrenScoreAverages = childChart.map(chart => chart.children_score_average)
                            childchildrenScoreAverages.forEach(average => {
                                returnchart.children_scores.push(average);
                            })
                        });
                        if (returnchart.children_scores !== undefined && returnchart.children_scores.length > 0) {
                            const validScores = returnchart.children_scores.filter((score): score is number => score !== undefined);
                            const total = sum(validScores);
                            returnchart.children_score_average = total / validScores.length;
                        } else {
                            returnchart.children_score_average = 0;
                        }
                    }
                });
            const data = {
                pages: portfolioPageData,
                charts: returnChartsData.reverse()
            }
            return c.json({ data: data }, 200);
        } catch (error) {
            console.error('Error processing request', error);
            return c.json({ message: 'Internal server error' });
        }
    }
);
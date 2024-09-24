import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { cors } from 'hono/cors';
import { z } from 'zod';

import { getAllPortfolioRaderChartLeaves, getPortfolioRaderChartLeaveByChartId } from "../db_operations/portfolio_leaves";
import { getPortfolioPage } from '../db_operations/portfolio_page';
import { getPortfolioRaderChart, getPortfolioRaderChartByChartId, updatePortfolioRaderChartsData } from '../db_operations/portfolio_rader_chart';
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

const updatePortfolioRaderChartsSchema = z.object({
    user_id: z.number(),
    charts: z.array(
        z.object({
            id: z.number().optional(),
            name: z.string(),
            page_id: z.number().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional()
        })
    ),
    relations: z.array(
        z.object({
            id: z.number().optional(),
            parent_id: z.number(),
            child_id: z.number(),
            page_id: z.number().optional(),
            depth: z.number(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional()
        })
    ),
    leaves: z.array(
        z.object({
            id: z.number().optional(),
            name: z.string(),
            score: z.number(),
            page_id: z.number().optional(),
            chart_id: z.number(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
            itemNum: z.number().optional()
        })
    )
});


PortfolioChartApp.put(
    '/',
    zValidator('json', updatePortfolioRaderChartsSchema),
    async (c) => {
        const { user_id, charts, relations, leaves } = await c.req.valid('json');

        try {

            const portfolioPageData = await getPortfolioPage(user_id);
            console.log(portfolioPageData);
            if (portfolioPageData == null) {
                return c.json({ message: 'Portfolio page is not existed' }, 400);
            }
            const portfolioChartData = await getPortfolioRaderChart(portfolioPageData.id);
            // idが含まれていない作成 && すでに page に紐づく chart が存在している場合は拒否
            if (!(charts.length > 0 && charts[0].id) && portfolioChartData.length) {
                return c.json({ message: 'Charts data is existed' }, 400);
            }

            // 1. チャートのデータを整形
            const portfolioChartsData = charts.map(chart => ({
                id: chart.id || null, // 更新のためにIDを含める
                name: chart.name,
                pageId: portfolioPageData.id, // 既存のポートフォリオページのIDを使用
            }));

            // 2. リレーションのデータを整形
            const portfolioRelationsData = relations.map(relation => ({
                id: relation.id || null, // 更新のためにIDを含める
                page_id: portfolioPageData.id,
                parentId: relation.parent_id,
                childId: relation.child_id,
                depth: relation.depth
            }));

            // 3. リーフのデータを整形
            const portfolioLeavesData = leaves.map(leave => ({
                id: leave.id || null, // 更新のためにIDを含める
                pageId: portfolioPageData.id,
                name: leave.name,
                score: leave.score,
                chartIndex: leave.chart_id
            }));

            // 4. トランザクション内でデータを更新
            const result = await updatePortfolioRaderChartsData(portfolioChartsData, portfolioRelationsData, portfolioLeavesData);

            return c.json({ message: 'Portfolio data updated successfully', data: result }, 200);

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
    '/all',
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

            type LeaveWithItemNum = {
                id: number;
                name: string;
                score: number;
                chart_id: number;
                page_id: number;
                createdAt: Date;
                updatedAt: Date;
                itemNum: number;
            };

            let updatedLeaves: LeaveWithItemNum[] = [];
            portfolioRaderCharts.forEach(chart => {
                const sameTargetChartLeave = portfolioRaderChartsLeaves.filter((leave) =>
                    leave.chart_id == chart.id
                );

                let j = 0;
                sameTargetChartLeave.forEach(leave => {
                    const updatedLeave: LeaveWithItemNum = { ...leave, itemNum: j };
                    updatedLeaves.push(updatedLeave)
                    j++;
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
                chartId: chart_id,
                charts: charts,
                leaves: leaves,
                relations: targetChartRelation
            }
            return c.json({ message: 'Portfolio children charts is finded', data: data }, 201);
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
    '/all/test',
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


            const returnChartsData: { id: number; title: string; label: string[]; childrenId: number[]; depth: number; createdAt: Date; updateAt: Date; childrenScores: (number | undefined)[]; childrenScoreAverage: number | undefined; }[] = [];

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
                    childrenId: childrenId,
                    depth: targetDepth - 1,
                    childrenScores: childrenScores,
                    childrenScoreAverage: childrenScoreAverage,
                    createdAt: portfolioRaderChart.createdAt,
                    updateAt: portfolioRaderChart.updatedAt
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
                        returnchart.childrenId.forEach(childId => {
                            const childChart = returnChartsData.filter((chart) =>
                                chart.id == childId
                            );
                            const childchildrenScoreAverages = childChart.map(chart => chart.childrenScoreAverage)
                            childchildrenScoreAverages.forEach(average => {
                                returnchart.childrenScores.push(average);
                            })
                        });
                        if (returnchart.childrenScores !== undefined && returnchart.childrenScores.length > 0) {
                            const validScores = returnchart.childrenScores.filter((score): score is number => score !== undefined);
                            const total = sum(validScores);
                            returnchart.childrenScoreAverage = total / validScores.length;
                        } else {
                            returnchart.childrenScoreAverage = 0;
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
import { Hono } from "hono";

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { updatePortfolioRaderChartsData, getPortfolioRaderChart, getPortfolioRaderChartByChartId } from '../db_operations/portfolio_rader_chart';
import { getAllPortfolioRaderChartRelations, getPortfolioRaderChartRelationsByParent, getPortfolioRaderChartRelationsByChartId } from "../db_operations/portfolio_rader_chart_relation";
import { getAllPortfolioRaderChartLeaves, getPortfolioRaderChartLeaveByChartId } from "../db_operations/portfolio_leaves";
import { getPortfolioPage } from '../db_operations/portfolio_page';
export const PortfolioChartApp = new Hono();

const updatePortfolioRaderChartsSchema = z.object({
    userId: z.number(),
    charts: z.array(
        z.object({
            id: z.number().optional(),
            name: z.string()
        })
    ),
    relations: z.array(
        z.object({
            id: z.number().optional(),
            parentId: z.number(),
            childId: z.number(),
            depth: z.number()
        })
    ),
    leaves: z.array(
        z.object({
            id: z.number().optional(),
            name: z.string(),
            score: z.number(),
            chartId: z.number()
        })
    )
});


PortfolioChartApp.put(
    '/',
    zValidator('json', updatePortfolioRaderChartsSchema),
    async (c) => {
        const { userId, charts, relations, leaves } = await c.req.valid('json');

        try {
            const portfolioPageData = await getPortfolioPage(userId);

            if (portfolioPageData == null) {
                return c.json({ message: 'Portfolio page is not existed' }, 400);
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
                parentId: relation.parentId,
                childId: relation.childId,
                depth: relation.depth,
            }));

            // 3. リーフのデータを整形
            const portfolioLeavesData = leaves.map(leave => ({
                id: leave.id || null, // 更新のためにIDを含める
                pageId: portfolioPageData.id,
                name: leave.name,
                score: leave.score,
                chartIndex: leave.chartId,
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

            const data = {
                pages: portfolioPageData,
                charts: portfolioRaderCharts,
                relations: portfolioRaderChartsRelations,
                leaves: portfolioRaderChartsLeaves
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

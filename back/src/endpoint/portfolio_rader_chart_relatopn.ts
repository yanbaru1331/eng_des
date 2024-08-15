import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { createPortfolioRaderChartRelation, getPortfolioRaderChartRelations, deletePortfolioRaderChartRelation } from '../db_operations/portfolio_rader_chart_relation';

export const portfolioRaderChartRelationApp = new Hono();

// create用の型チェック
const createRelationSchema = z.object({
    parentId: z.number(),
    childId: z.number(),
    depth: z.number().optional()
});

// /portfolio/rader-chart-relation/
portfolioRaderChartRelationApp.post(
    '/',
    zValidator('json', createRelationSchema),
    async (c) => {
        const relationData = await c.req.valid("json");

        try {
            const newRelation = await createPortfolioRaderChartRelation(relationData);
            return c.json({ message: 'Portfolio Rader Chart Relation created successfully', relationId: newRelation.id }, 201);
        } catch (error) {
            console.error('Error creating relation:', error);
            return c.json({ error: 'Failed to create relation' }, 500);
        }
    }
);

// /portfolio/rader-chart-relation/
portfolioRaderChartRelationApp.get(
    '/',
    async (c) => {
        try {
            const relations = await getPortfolioRaderChartRelations();
            return c.json(relations, 200);
        } catch (error) {
            console.error('Error fetching relations:', error);
            return c.json({ error: 'Failed to fetch relations' }, 500);
        }
    }
);


import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export async function createPortfolioRaderChartRelation(relationData: Prisma.portfolio_rader_chart_relationsCreateManyInput[]) {
    try {
        const portfolioRaderChartRelation = await prisma.portfolio_rader_chart_relations.createMany({
            data: relationData
        });
        return portfolioRaderChartRelation;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
};

export async function getAllPortfolioRaderChartRelations(pageId: number) {
    try {
        const portfolioRaderChartRelations = await prisma.portfolio_rader_chart_relations.findMany({
            where: { page_id: pageId }
        });
        return portfolioRaderChartRelations;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}

export async function getPortfolioRaderChartRelationsByParent(parentId: number) {
    try {
        const portfolioRaderChartRelations = await prisma.portfolio_rader_chart_relations.findMany({
            where: { parent_id: parentId },
        });
        return portfolioRaderChartRelations;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}

export async function getPortfolioRaderChartRelationsByChild(childId: number) {
    try {
        const portfolioRaderChartRelation = await prisma.portfolio_rader_chart_relations.findMany({
            where: { child_id: childId },
        });
        return portfolioRaderChartRelation;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}

export async function getPortfolioRaderChartRelationsByChartId(chartId: number) {
    try {
        const portfolioRaderChartRelation = await prisma.portfolio_rader_chart_relations.findMany({
            where: {
                OR: [
                    {
                        parent_id: chartId
                    },
                    {
                        child_id: chartId
                    }
                ]
            }
        });
        return portfolioRaderChartRelation;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}

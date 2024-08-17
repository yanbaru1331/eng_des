import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export async function createPortfolioRaderChartLeaves(data: Prisma.portfolio_rader_chart_leavesCreateManyInput[]) {
    try {
        const createPortfolioRaderChartLeaves = await prisma.portfolio_rader_chart_leaves.createMany({
            data: data
        });
        return createPortfolioRaderChartLeaves;
    } catch (error) {
        console.error('Error creating portfolio leaves', error);
        throw error;
    }
}

export async function getAllPortfolioRaderChartLeaves(pageId: number) {
    try {
        const getPortfolioRaderChartLeaves = await prisma.portfolio_rader_chart_leaves.findMany({
            where: { page_id: pageId }
        });
        return getPortfolioRaderChartLeaves;
    } catch (error) {
        console.error('Error fetching portfolio charts:', error);
        throw error;
    }
}

export async function getPortfolioRaderChartLeaveByChartId(chartId: number) {
    try {
        const getPortfolioRaderChartLeave = await prisma.portfolio_rader_chart_leaves.findMany({
            where: { chart_id: chartId }
        });
        return getPortfolioRaderChartLeave;
    } catch (error) {
        console.error('Error fetching portfolio charts:', error);
        throw error;
    }
}

export async function updatePortfolioRaderChartLeaves(
    dataList: { where: Prisma.portfolio_rader_chart_leavesWhereUniqueInput; data: Prisma.portfolio_rader_chart_leavesUpdateInput }[]
) {
    try {
        const updatedPortfolioChartLeaves = await prisma.$transaction(
        dataList.map((data) => prisma.portfolio_rader_chart_leaves.update(data))
        );
        return updatedPortfolioChartLeaves;
    } catch (error) {
    console.error('Error updating portfolio chart leaves:', error);
    throw error;
    }
}
import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export async function createPortfolioRaderCharts(data: Prisma.portfolio_rader_chartsCreateManyInput[]) {
    try {
        const createPortfolioRaderCharts = [];

        for (const chartData of data) {
            const createdChart = await prisma.portfolio_rader_charts.create({
                data: chartData,
            });
            createPortfolioRaderCharts.push(createdChart);
        }

        return createPortfolioRaderCharts;
    } catch (error) {
        console.error('Error creating portfolio charts:', error);
        throw error;
    }
}


export async function updatePortfolioRaderChartsData(
    portfolioChartsData: { id: number | null, name: string, pageId: number }[],
    portfolioRelationsData: { id: number | null, parentId: number, childId: number, depth: number }[],
    portfolioLeavesData: { id: number | null, name: string, score: number, chartIndex: number }[]
) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. チャートの更新または作成
            const updatedCharts = [];
            for (const chartData of portfolioChartsData) {
                if (chartData.id) {
                    const updatedChart = await prisma.portfolio_rader_charts.update({
                        where: { id: chartData.id },
                        data: {
                            id: chartData.id,
                            name: chartData.name,
                            page_id: chartData.pageId
                        }
                    });
                    updatedCharts.push(updatedChart);
                } else {
                    const createdChart = await prisma.portfolio_rader_charts.create({
                        data: {
                            name: chartData.name,
                            page_id: chartData.pageId
                        }
                    });
                    updatedCharts.push(createdChart);
                }
            }

            console.log(updatedCharts);

            // 2. リレーションの更新または作成
            const updatedRelations = [];
            for (const relation of portfolioRelationsData) {
                const parentChartId = updatedCharts[relation.parentId].id;
                const childChartId = updatedCharts[relation.childId].id;

                if (relation.id) {
                    const updatedRelation = await prisma.portfolio_rader_chart_relations.update({
                        where: { id: relation.id },
                        data: {
                            parent_id: parentChartId,
                            child_id: childChartId,
                            depth: relation.depth,
                        },
                    });
                    updatedRelations.push(updatedRelation);
                } else {
                    const createdRelation = await prisma.portfolio_rader_chart_relations.create({
                        data: {
                            page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                            parent_id: parentChartId,
                            child_id: childChartId,
                            depth: relation.depth,
                        },
                    });
                    updatedRelations.push(createdRelation);
                }
            }

            console.log(updatedRelations);

            // 3. リーフの更新または作成
            const updatedLeaves = [];
            for (const leave of portfolioLeavesData) {
                const chartId = updatedCharts[leave.chartIndex].id;

                if (leave.id) {
                    const updatedLeave = await prisma.portfolio_rader_chart_leaves.update({
                        where: { id: leave.id },
                        data: {
                            name: leave.name,
                            score: leave.score,
                            chart_id: chartId,
                        },
                    });
                    updatedLeaves.push(updatedLeave);
                } else {
                    const createdLeave = await prisma.portfolio_rader_chart_leaves.create({
                        data: {
                            page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                            name: leave.name,
                            score: leave.score,
                            chart_id: chartId,
                        },
                    });
                    updatedLeaves.push(createdLeave);
                }
            }

            console.log(updatedLeaves);

            return { updatedCharts, updatedRelations, updatedLeaves };
        });

        return result;

    } catch (error) {
        console.error('Error updating portfolio data:', error);
        throw error; // トランザクション全体がロールバックされます
    }
}



export async function getPortfolioRaderChart(pageId: number) {
    try {
        const getPortfolioRaderCharts = await prisma.portfolio_rader_charts.findMany({
            where: { page_id: pageId }
        });
        return getPortfolioRaderCharts;
    } catch (error) {
        console.error('Error fetching portfolio charts:', error);
        throw error;
    }
}

export async function getPortfolioRaderChartByChartId(chartId: number) {
    try {
        const getPortfolioRaderChart = await prisma.portfolio_rader_charts.findUnique({
            where: { id: chartId }
        });
        return getPortfolioRaderChart;
    } catch (error) {
        console.error('Error fetching portfolio chart:', error);
        throw error;
    }
}

export async function updatePortfolioRaderCharts(
    dataList: { where: Prisma.portfolio_rader_chartsWhereUniqueInput; data: Prisma.portfolio_rader_chartsUpdateInput }[]
) {
    try {
        const updatedPortfolioCharts = await prisma.$transaction(
            dataList.map((data) => prisma.portfolio_rader_charts.update(data))
        );
        return updatedPortfolioCharts;
    } catch (error) {
        console.error('Error updating portfolio charts:', error);
        throw error;
    }
}

export async function deletePortfolioRaderChart(chart_id: number) {
    try {
        const deletedPortfolioRaderChart = await prisma.portfolio_rader_charts.delete({
            where: { id: chart_id }
        });
        return deletedPortfolioRaderChart;
    } catch (error) {
        console.error('Error deleting portfolio chart:', error);
        throw error;
    }
}
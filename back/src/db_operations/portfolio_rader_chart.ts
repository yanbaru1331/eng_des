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
export async function createPortfolioRaderChartsData(
    portfolioChartsData: { name: string, pageId: number }[],
    portfolioRelationsData: { parentId: number, childId: number, depth: number }[],
    portfolioLeavesData: { name: string, score: number, chartIndex: number }[]
) {
    try {
        console.log(portfolioChartsData);
        console.log(portfolioRelationsData);
        console.log(portfolioLeavesData);
        const result = await prisma.$transaction(async (prisma) => {
            // 1. チャートの更新または作成
            const createdCharts: {
                id: number;
                name: string;
                page_id: number;
                createdAt: Date;
                updatedAt: Date;
            }[] = [];
            for (const chartData of portfolioChartsData) {

                const createdChart = await prisma.portfolio_rader_charts.create({
                    data: {
                        name: chartData.name,
                        page_id: chartData.pageId
                    }
                });
                createdCharts.push(createdChart);
            }

            // 2. リレーションの更新または作成
            const createdRelations = [];
            for (const relation of portfolioRelationsData) {

                const parentChartId = createdCharts[relation.parentId].id;
                const childChartId = createdCharts[relation.childId].id;


                const createdRelation = await prisma.portfolio_rader_chart_relations.create({
                    data: {
                        page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                        parent_id: parentChartId,
                        child_id: childChartId,
                        depth: relation.depth,
                    },
                });
                createdRelations.push(createdRelation);

            }

            // 3. リーフの更新または作成
            const createdLeaves = [];
            for (const leave of portfolioLeavesData) {
                const chartId = createdCharts[leave.chartIndex].id;

                const createdLeave = await prisma.portfolio_rader_chart_leaves.create({
                    data: {
                        page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                        name: leave.name,
                        score: leave.score,
                        chart_id: chartId,
                    },
                });
                createdLeaves.push(createdLeave);

            }


            return { createdCharts, createdRelations, createdLeaves };
        });

        return result;

    } catch (error) {
        console.error('Error updating portfolio data:', error);
        throw error; // トランザクション全体がロールバックされます
    }
}

export async function updatePortfolioRaderChartsData(
    portfolioChartsData: { id: number, pageId: number, name: string }[],
    portfolioRelationsData: { id: number, pageId: number, parentId: number, childId: number, depth: number }[],
    portfolioLeavesData: { id: number, pageId: number, name: string, score: number, chartId: number }[]
) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. チャートの更新または作成
            const updatedCharts: { id: number; }[] = [];
            for (const chartData of portfolioChartsData) {
                console.log(chartData.id);
                const updatedChart = await prisma.portfolio_rader_charts.update({
                    where: { id: chartData.id },
                    data: {
                        id: chartData.id,
                        name: chartData.name
                    }
                });
                updatedCharts.push(updatedChart);
            }

            // 2. リレーションの更新または作成
            const updatedRelations = [];
            console.log(portfolioRelationsData);
            for (const relation of portfolioRelationsData) {

                const parentChart = updatedCharts.find(chart => chart.id === relation.parentId);
                const childChart = updatedCharts.find(chart => chart.id === relation.childId);
                if (parentChart && childChart) {
                    if (relation.id) {
                        const updatedRelation = await prisma.portfolio_rader_chart_relations.update({
                            where: { id: relation.id },
                            data: {
                                parent_id: parentChart.id,
                                child_id: childChart.id,
                                depth: relation.depth,
                            },
                        });
                        updatedRelations.push(updatedRelation);
                    } else {
                        const createdRelation = await prisma.portfolio_rader_chart_relations.create({
                            data: {
                                page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                                parent_id: parentChart.id,
                                child_id: childChart.id,
                                depth: relation.depth,
                            },
                        });
                        updatedRelations.push(createdRelation);
                    }
                }
            }

            console.log(updatedRelations);

            // 3. リーフの更新または作成
            const updatedLeaves = [];
            for (const leave of portfolioLeavesData) {
                const updatedLeave = await prisma.portfolio_rader_chart_leaves.update({
                    where: { id: leave.id },
                    data: {
                        name: leave.name,
                        score: leave.score,
                        chart_id: leave.chartId
                    },
                });
                updatedLeaves.push(updatedLeave);
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
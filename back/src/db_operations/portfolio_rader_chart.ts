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
            const created_charts: {
                id: number;
                name: string;
                page_id: number;
                created_at: Date;
                updated_at: Date;
            }[] = [];
            for (const chartData of portfolioChartsData) {

                const createdChart = await prisma.portfolio_rader_charts.create({
                    data: {
                        name: chartData.name,
                        page_id: chartData.pageId
                    }
                });
                created_charts.push(createdChart);
            }

            // 2. リレーションの更新または作成
            const created_relations: { id: number; page_id: number; parent_id: number; child_id: number; depth: number; created_at: Date; updated_at: Date; }[] = [];
            for (const relation of portfolioRelationsData) {

                const parentChartId = created_charts[relation.parentId].id;
                const childChartId = created_charts[relation.childId].id;


                const createdRelation = await prisma.portfolio_rader_chart_relations.create({
                    data: {
                        page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                        parent_id: parentChartId,
                        child_id: childChartId,
                        depth: relation.depth,
                    },
                });
                created_relations.push(createdRelation);

            }

            // 3. リーフの更新または作成
            const created_leaves = [];
            for (const leave of portfolioLeavesData) {
                const chartId = created_charts[leave.chartIndex].id;

                const createdLeave = await prisma.portfolio_rader_chart_leaves.create({
                    data: {
                        page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                        name: leave.name,
                        score: leave.score,
                        chart_id: chartId,
                    },
                });
                created_leaves.push(createdLeave);

            }


            return { created_charts, created_relations, created_leaves };
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
            const updated_charts: { id: number; }[] = [];
            for (const chartData of portfolioChartsData) {
                console.log(chartData.id);
                const updatedChart = await prisma.portfolio_rader_charts.update({
                    where: { id: chartData.id },
                    data: {
                        id: chartData.id,
                        name: chartData.name
                    }
                });
                updated_charts.push(updatedChart);
            }

            // 2. リレーションの更新または作成
            const updated_relations = [];
            console.log(portfolioRelationsData);
            for (const relation of portfolioRelationsData) {

                const parentChart = updated_charts.find(chart => chart.id === relation.parentId);
                const childChart = updated_charts.find(chart => chart.id === relation.childId);
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
                        updated_relations.push(updatedRelation);
                    } else {
                        const createdRelation = await prisma.portfolio_rader_chart_relations.create({
                            data: {
                                page_id: portfolioChartsData[0].pageId, // 一つのページに関連付ける
                                parent_id: parentChart.id,
                                child_id: childChart.id,
                                depth: relation.depth,
                            },
                        });
                        updated_relations.push(createdRelation);
                    }
                }
            }

            console.log(updated_relations);

            // 3. リーフの更新または作成
            const updated_leaves = [];
            for (const leave of portfolioLeavesData) {
                const updatedLeave = await prisma.portfolio_rader_chart_leaves.update({
                    where: { id: leave.id },
                    data: {
                        name: leave.name,
                        score: leave.score,
                        chart_id: leave.chartId
                    },
                });
                updated_leaves.push(updatedLeave);
            }

            console.log(updated_leaves);

            return { updated_charts, updated_relations, updated_leaves };
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
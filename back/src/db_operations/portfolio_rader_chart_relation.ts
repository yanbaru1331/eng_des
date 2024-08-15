import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export const createPortfolioRaderChartRelation = async (relationData: { parentId: number, childId: number, depth?: number }) => {
    return prisma.portfolioRaderChartRelation.create({
        data: relationData,
    });
};

export async function getPortfolioPage(userId: number) {
    try {
        const portfolioPage = await prisma.portfolioPage.findUnique({
            where: { user_id: userId },
        });
        return portfolioPage;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}



export const getPortfolioRaderChartRelations = async () => {
    return prisma.portfolioRaderChartRelation.findMany();
};

export const deletePortfolioRaderChartRelation = async (parentId: number, childId: number) => {
    return prisma.portfolioRaderChartRelation.delete({
        where: {
            parentId_childId: {
                parentId: parentId,
                childId: childId,
            },
        },
    });
};

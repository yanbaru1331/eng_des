import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export async function createPortfolioPage(pageData: Prisma.portfolio_pagesCreateInput, scoreStandardsData: string[]) {
    try {
        return await prisma.$transaction(async (prisma) => {
            const createdPage = await prisma.portfolio_pages.create({
                data: pageData,
            });
            await prisma.score_standards.createMany({
                data: scoreStandardsData.map((standard: string, index: number) => ({
                    page_id: createdPage.id,
                    standard: standard,
                    score_num: index
                })),
            });
            const createdScoreStandards = await prisma.score_standards.findMany({
                where: {
                    page_id: createdPage.id,  // 作成したページのIDに関連するレコードを取得
                },
            });
            const createdData = {
                createdPage: createdPage,
                createdScoreStandards: createdScoreStandards
            }
            console.log(createdPage);
            console.log(createdScoreStandards)
            return createdData;
        })
    } catch (error) {
        console.error('Error creating portfolio page:', error);
        throw error;
    }
}

export async function getPortfolioPage(userId: number) {
    try {
        const portfolioPage = await prisma.portfolio_pages.findUnique({
            where: { user_id: userId },
        });
        return portfolioPage;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}

export async function getScoreStandards(pageId: number) {
    try {
        const scoreStandards = await prisma.score_standards.findMany({
            where: { page_id: pageId },
        });
        return scoreStandards;
    } catch (error) {
        console.error('Error fetching score standard:', error);
        throw error;
    }
}

export async function updatePortfolioPage(userId: number, updateData: Prisma.portfolio_pagesCreateInput) {
    try {
        const updatedPortfolioPage = await prisma.portfolio_pages.update({
            where: { user_id: userId },
            data: updateData,
        });
        return updatedPortfolioPage;
    } catch (error) {
        console.error('Error updating portfolio page:', error);
        throw error;
    }
}

export async function deletePortfolioPage(userId: number) {
    try {
        const deletedPortfolioPage = await prisma.portfolio_pages.delete({
            where: { user_id: userId },
        });
        return deletedPortfolioPage;
    } catch (error) {
        console.error('Error deleting portfolio page:', error);
        throw error;
    }
}
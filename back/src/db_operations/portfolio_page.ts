import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export async function createPortfolioPage(data: Prisma.portfolio_pagesCreateInput) {
    try {
        const portfolioPage = await prisma.portfolio_pages.create({
            data: data,
        });
        return portfolioPage;
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
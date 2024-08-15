import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';

export async function getPortfolioPage(userId: number) {
    try {
        const portfolioPage = await prisma.portfolioPage.findUnique({
            where: { userId: userId },
        });
        return portfolioPage;
    } catch (error) {
        console.error('Error fetching portfolio page:', error);
        throw error;
    }
}

export async function createPortfolioPage(data: Prisma.PortfolioPageCreateInput) {
    try {
        const portfolioPage = await prisma.portfolioPage.create({
            data: data,
        });
        return portfolioPage;
    } catch (error) {
        console.error('Error creating portfolio page:', error);
        throw error;
    }
}

export async function updatePortfolioPage(userId: number, updateData: Prisma.PortfolioPageCreateInput) {
    try {
        const updatedPortfolioPage = await prisma.portfolioPage.update({
            where: { userId: userId },
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
        const deletedPortfolioPage = await prisma.portfolioPage.delete({
            where: { userId: userId },
        });
        return deletedPortfolioPage;
    } catch (error) {
        console.error('Error deleting portfolio page:', error);
        throw error;
    }
}
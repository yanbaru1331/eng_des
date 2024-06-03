import { Prisma, PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function createUser(data: Prisma.UserCreateInput) {
    try {
        const user = await prisma.user.create({
            data,
        });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function getUser(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                PortfolioTabs: true,
                PortfolioPage: true,
            },
        });
        if (!user) {
            throw new Error('User not found');  // ユーザーが見つからない場合のエラー
        }
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function deleteUser(id: number) {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        return deletedUser;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
        });
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
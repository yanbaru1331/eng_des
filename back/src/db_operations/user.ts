import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';


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

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                portfolioPages: true,
            },
        });
        return user || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function getUserByUsername(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                portfolioPages: true,
            },
        });
        return user || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function getUserById(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                portfolioPages: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function deleteUser(email: string) {
    try {
        const deletedUser = await prisma.user.delete({
            where: { email },
        });
        return deletedUser;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

// 必要そうなら書く
export async function updateUser(id: number, email: string, username: string) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email: email,
                username: username,
            }
        });
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
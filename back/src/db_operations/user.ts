import { Prisma } from '@prisma/client';
import prisma from '../prisma_client';


export async function createUser(data: Prisma.usersCreateInput) {
    try {
        const user = await prisma.users.create({
            data,
        });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    };
};

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.users.findUnique({
            where: { email }
        });
        return user || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    };
};

export async function getUserByUsername(username: string) {
    try {
        const user = await prisma.users.findUnique({
            where: { username }
        });
        return user || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    };
};

export async function getUserById(id: number) {
    try {
        const user = await prisma.users.findUnique({
            where: { id }
        });
        if (!user) {
            throw new Error('User not found');
        };
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    };
};

export async function deleteUser(id: number) {
    try {
        const deletedUser = await prisma.users.delete({
            where: { id }
        });
        return deletedUser;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    };
};

// 必要そうなら書く
export async function updateUser(id: number, email: string, username: string) {
    try {
        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                email: email,
                username: username
            }
        });
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    };
};
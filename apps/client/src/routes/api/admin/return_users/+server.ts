// src/routes/api/users/+server.ts
import { prisma } from '$lib/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
    }
};

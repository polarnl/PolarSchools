import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { auth } from 'better-auth';

// Initialize Better Auth middleware
const { verifyToken } = auth({
    // Example: secret or configuration for your tokens
    secret: process.env.AUTH_SECRET || 'supersecret',
});

export async function POST(event: RequestEvent) {
    try {
        // Extract Bearer token from Authorization header
        const authHeader = event.request.headers.get('authorization');
        if (!authHeader) throw error(401, 'Authorization header missing');

        const token = authHeader.replace('Bearer ', '');
        const payload = await verifyToken(token);
        if (!payload) throw error(401, 'Invalid or expired token');

        // Fetch user from DB
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) throw error(401, 'User not found');
        if (user.role !== 'admin') throw error(403, 'Only admins can create organisations');

        // Get organisation data from request
        const { name } = await event.request.json();
        if (!name) throw error(400, 'Organisation name is required');

        // Create organisation
        const organisatie = await prisma.organisatie.create({
            data: {
                name,
                users: {
                    connect: { id: user.id } // optionally add creator as first user
                }
            },
        });

        return json(organisatie);

    } catch (err: any) {
        return json({ error: err.message }, { status: err.status || 500 });
    }
}

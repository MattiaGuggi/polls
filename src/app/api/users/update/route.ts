import { updateUserInDb } from '@/lib/db';

export async function POST(request) {
    const user = await request.json();

    try {
        await updateUserInDb(user);

        return new Response(JSON.stringify({ success: true, message: 'User updated successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: 'Cannot update user' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

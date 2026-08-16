import { createUserInDb } from '@/lib/db';

export async function POST(request: Request) {
    const { name, email, password } = await request.json();
    const user = await createUserInDb(name, email, password);
    if (user) {
        return new Response(JSON.stringify({ success: true, user }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'User already exists' }), {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

import { registerUser } from '@/lib/auth';

export async function POST(request) {
    const { name, email, password } = await request.json();
    const user = registerUser(name, email, password);
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

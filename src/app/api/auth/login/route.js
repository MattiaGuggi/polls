import { authenticateUser } from '../../../../lib/auth';

export async function POST(request) {
    const { email, password } = await request.json();
    const user = authenticateUser(email, password);
    
    if (user) {
        return new Response(JSON.stringify({ success: true, user }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

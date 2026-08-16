import { getUserFromDb } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const user = await getUserFromDb({ email });

    // Verifica della password in chiaro con l'hash bcrypt presente a DB
    if (user && await bcrypt.compare(password, user.password)) {
        const safeUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };

        return new Response(JSON.stringify({ success: true, user: safeUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    
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

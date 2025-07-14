import { createPoll } from '../../../../lib/polls';

export async function POST(request) {
    const poll = await request.json();

    try {
        await createPoll(poll);
        
        return new Response(JSON.stringify({ success: true, poll: poll, message: 'Poll created correctly' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch(err) {
        return new Response(JSON.stringify({ success: false, message: 'Cannot create poll' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

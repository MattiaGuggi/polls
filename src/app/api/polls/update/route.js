import { updatePoll } from '../../../../lib/polls';

export async function POST(request) {
    const { poll } = await request.json();

    try {
        updatePoll(poll);

        return new Response(JSON.stringify({ success: true, message: 'Poll updated successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: 'Cannot update poll' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

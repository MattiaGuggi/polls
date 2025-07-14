import { getPolls } from '../../../../lib/polls';

export async function GET() {
    const polls = await getPolls();
    
    if (polls) {
        return new Response(JSON.stringify({ success: true, polls: polls, message: 'Poll retrieved correctly' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'No poll found with this id' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

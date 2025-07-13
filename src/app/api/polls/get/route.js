import { getPoll } from '../../../../lib/polls';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const poll = getPoll(id);
    console.log('Poll: ', poll);
    
    if (poll) {
        return new Response(JSON.stringify({ success: true, poll: poll, message: 'Poll retrieved correctly' }), {
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

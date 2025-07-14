import { deletePoll } from '../../../../lib/polls';

export async function DELETE(request) {
    try {
        const { id } = request.body;
        await deletePoll(id);

        return new Response(JSON.stringify({ success: true, poll: poll, message: 'Poll deleted correctly' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch(err) {
        return new Response(JSON.stringify({ success: false, message: 'Error deleting poll' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

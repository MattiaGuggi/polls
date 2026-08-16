import { deletePoll } from '@/lib/db';

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await deletePoll(id);

        return new Response(JSON.stringify({ success: true, message: 'Poll deleted correctly' }), {
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

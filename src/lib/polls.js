import { getPollsFromDb, getPollFromDb, updatePollInDb, deletePollFromDb, createPollInDb } from "./db";

export async function getPolls() 
{
    try {
        let polls = await getPollsFromDb();
        
        return polls;
    } catch (err) {
        console.error('Error getting polls', err);
    }
}

export async function updatePoll(newPoll) {
    try {
        await updatePollInDb(newPoll);

        return newPoll;
    } catch (err) {
        console.error('Error updating poll', err);
    }
}

export async function getPoll(id) {
    const poll = await getPollFromDb({ _id: id});

    return poll;
}

export async function createPoll(poll) {
    try {
        const newPoll = await createPollInDb(poll);
        return newPoll;
    } catch (err) {
        console.error('Error creating poll', err);
    }
}

export async function deletePoll(id) {
    try {
        const poll = await getPollFromDb({ _id: id });
        if (!poll) {
            throw new Error('Poll not found');
        }
        await deletePollFromDb(poll);
        return { success: true, message: 'Poll deleted successfully' };
    } catch (err) {
        console.error('Error deleting poll', err);
        return { success: false, message: err.message };
    }
}

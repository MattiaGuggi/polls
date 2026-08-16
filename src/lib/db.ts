import mongoose from "mongoose";
import { User, Poll } from "./models";
import bcrypt from "bcrypt";
import { pollType, userType } from "./types";

/**
 * Connects to MongoDB
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process with failure (0 successfull, 1 failure)
    }
};
/**
 * Helper function to get every user from MongoDB
 */
export const getUsersFromDb = async () => {
    await connectDB();
    return await User.find({});
}
/**
 * Finds user in DB based on email/username
 *
 * @param {criteria} criteria - The criteria
 * @returns {User} User - A user saved in the DB
 */
export const getUserFromDb = async (criteria: { email: string }) => {
    await connectDB();
    return await User.findOne({ email: criteria.email });
};
/**
 * Creates user in DB 
 *
 * @param {newUser} newUser - User to create in DB
*/
export const createUserInDb = async (name: string, email: string, password: string) => {
    await connectDB();
    const existingUser = await User.find({ email });
    // Check if the user already exists
    if (existingUser.length > 0) {
        throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ 
        username: name, 
        email: email, 
        password: hashedPassword 
    });
    
    await user.save();

    return user;
};
/**
 * Updates an existing user
 *
 * @param {user} user - the user you need to update
 * @returns {void}
 */
export const updateUserInDb = async (user: userType) => {
    await connectDB();
    try  {
        await User.findByIdAndUpdate(user._id, { $set: user }, { new: true }); // Update the user and return the updated document
    } catch (err) {
        console.error('Error updating user', err);
    }
};
/**
 * Updates every users' formation reference from the oldUsername to the newUsername
 *
 * @param {user} user - the user you need to delete
 * @returns {void}
 */
export const deleteUserFromDb = async (user: userType) => {
    await connectDB();
    try {
        await User.findByIdAndDelete(user._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting user', err);
    }
};

export async function getPolls() 
{
    try {
        await connectDB();
        const polls = await Poll.find({});
        
        return polls;
    } catch (err) {
        console.error('Error getting polls', err);
    }
}

export async function updatePoll(newPoll: pollType) {
    try {
        await connectDB();
        await Poll.findByIdAndUpdate(newPoll._id, { $set: newPoll }, { new: true }); // Update the poll and return the updated document

        return newPoll;
    } catch (err) {
        console.error('Error updating poll', err);
    }
}

export async function getPoll(id: string) {
    await connectDB();
    const poll = await Poll.findOne({ _id: id });

    return poll;
}

export async function createPoll(poll: pollType) {
    try {
        await connectDB();
        const newPoll = new Poll(poll);
        await newPoll.save();
        return newPoll;
    } catch (err) {
        console.error('Error creating poll', err);
    }
}

export async function deletePoll(id: number) {
    try {
        await connectDB();
        const poll = await Poll.findOne({ _id: id }); 
        if (!poll) {
            throw new Error('Poll not found');
        }
        await Poll.findByIdAndDelete(poll._id); // Delete the user by ID
        return { success: true, message: 'Poll deleted successfully' };
    } catch (err) {
        console.error('Error deleting poll', err);
        return { success: false, message: err.message };
    }
}

import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    pfp: { type: String, default: 'https://www.starksfamilyfh.com/image/9/original' },
});

const User = mongoose.model('User', userSchema);
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
export const getUsersFromDB = async () => {
    await connectDB();
    return await User.find({});
}
/**
 * Finds user in DB based on email/username
 *
 * @param {criteria} criteria - The criteria(email/username)
 * @returns {User} User - A user saved in the DB
 */
export const getUserFromDb = async (criteria) => {
    await connectDB();
    return await User.findOne(criteria); // Ensure you're passing the correct criteria
};
/**
 * Creates user in DB 
 *
 * @param {newUser} newUser - User to create in DB
*/
export const createUser = async (newUser) => {
    await connectDB();
    const existingUser = await User.find({ email: newUser.email });
    // Check if the user already exists
    if (existingUser.length > 0) {
        throw new Error('User already exists');
    }
    const user = new User(newUser);
    await user.save();
};
/**
 * Updates an existing user
 *
 * @param {user} user - the user you need to update
 * @returns {void}
 */
export const updateUser = async (user) => {
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
export const deleteUser = async (user) => {
    await connectDB();
    try {
        await User.findByIdAndDelete(user._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting user', err);
    }
};

// Define the User schema
const pollSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: String, required: true },
    participants: { type: [], required: true },
    scoreboard: { type: [], required: true },
    image: { type: String, default: 'https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg' }
});

const Poll = mongoose.model('Poll', pollSchema);

/**
 * Helper function to get every poll from MongoDB
 */
export const getPollsFromDB = async () => {
    await connectDB();
    return await Poll.find({});
}
/**
 * Finds poll in DB based on id
 *
 * @param {criteria} criteria - The criteria(id)
 * @returns {Poll} Poll - A poll saved in the DB
 */
export const getPollFromDb = async (criteria) => {
    await connectDB();
    return await Poll.findOne(criteria); // Ensure you're passing the correct criteria
};
/**
 * Creates poll in DB
 *
 * @param {newPoll} newPoll - Poll to create in DB
*/
export const createPollInDb = async (newPoll) => {
    await connectDB();
    const poll = new Poll(newPoll);
    await poll.save();
};
/**
 * Updates an existing poll
 *
 * @param {poll} poll - the poll you need to update
 * @returns {void}
 */
export const updatePollInDb = async (poll) => {
    await connectDB();
    try  {
        await Poll.findByIdAndUpdate(poll._id, { $set: poll }, { new: true }); // Update the user and return the updated document
    } catch (err) {
        console.error('Error updating poll', err);
    }
};
/**
 * Deletes a poll from the database
 *
 * @param {poll} poll - the poll you need to delete
 * @returns {void}
 */
export const deletePollFromDb = async (poll) => {
    await connectDB();
    try {
        await Poll.findByIdAndDelete(poll._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting poll', err);
    }
};
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    pfp: { type: String, default: 'https://www.starksfamilyfh.com/image/9/original' },
});

export const User = mongoose.model('User', userSchema);

const pollSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: String, required: true },
    participants: { type: [], required: true },
    scoreboard: { type: [], required: true },
    image: { type: String, default: 'https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg' }
});

export const Poll = mongoose.model('Poll', pollSchema);
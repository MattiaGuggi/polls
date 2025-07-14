import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    pfp: { type: String, default: 'https://www.starksfamilyfh.com/image/9/original' },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 1500 }, // This will map to MongoDB Int32
}, { _id: false }); // Disable _id for subdocs if you don't want auto-generated _id fields

const pollSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // adjust ref if needed
  participants: { type: [participantSchema], required: true },
  scoreboard: { type: [participantSchema], required: true },
  image: {
    type: String,
    default: 'https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg'
  }
});

export const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema);

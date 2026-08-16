import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  pfp: { type: String, default: 'https://www.starksfamilyfh.com/image/9/original' },
});

export type IUser = InferSchemaType<typeof userSchema>;
export const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', userSchema);

const participantSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 1500 },
}, { _id: false });

const pollSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: { type: [participantSchema], required: true },
  scoreboard: { type: [participantSchema], required: true },
  image: {
    type: String,
    default: 'https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg'
  }
});

export type IPoll = InferSchemaType<typeof pollSchema>;
export const Poll = (mongoose.models.Poll as Model<IPoll>) || mongoose.model<IPoll>('Poll', pollSchema);

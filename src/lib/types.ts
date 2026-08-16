export type participantType = {
    _id?: string;
    name?: string;
    rating?: number;
    image?: string;
}

export type pollType = {
     _id?: string;
    name?: string;
    image?: string;
    creator?: string;
    participants?: participantType[];
    scoreboard?: participantType[];
}

export type userType = {
    _id?: string;
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    pfp?: string;
};
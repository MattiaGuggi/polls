import { getPollsFromDB, getPollFromDB, updatePollInDb } from "./db";

let polls = [
    {
        _id: 1,
        name: 'Best singers/actresses',
        creator: 'panda',
        participants: [
            { name: 'Alessia Lanza', image: '', rating: 1500 },
            { name: 'Yasmine Barbieri', image: '', rating: 1500 },
            { name: 'Emily Pallini', image: '', rating: 1500 },
            { name: 'Mia Lobosco', image: '', rating: 1500 },
            { name: 'Alice Perego', image: '', rating: 1500 },
            { name: 'Alice Carollo', image: '', rating: 1500 },
            { name: 'Iris Didomenico', image: '', rating: 1500 },
            { name: 'Nicky Passarella', image: '', rating: 1500 },
            { name: 'Barbara Marrocco', image: '', rating: 1500 },
            { name: 'Carla Famulari', image: '', rating: 1500 },
            { name: 'Aurora Mariani', image: '', rating: 1500 },
            { name: 'Anais Mariani', image: '', rating: 1500 },
            { name: 'Gaia Garavaglia', image: '', rating: 1500 },
            { name: 'Alice Muzza', image: '', rating: 1500 },
            { name: 'Lisa Luchetta', image: '', rating: 1500 },
            { name: 'Virginia Bellora', image: '', rating: 1500 },
            { name: 'Giulia Paglianiti', image: '', rating: 1500 },
            { name: 'Anna Pepe', image: '', rating: 1500 },
            { name: 'Dalila Stabile', image: '', rating: 1500 },
            { name: `Martina Dell' Anna`, image: '', rating: 1500 },
            { name: 'Lasagna', image: '', rating: 1500 },
            { name: 'Iris Vallarani', image: '', rating: 1500 },
            { name: 'Nicole Giustolisi', image: '', rating: 1500 },
            { name: 'Alice De Bortoli', image: '', rating: 1500 },
            { name: 'Clizia Quaglio', image: '', rating: 1500 },
            { name: 'Giorgia Mordenti', image: '', rating: 1500 },
            { name: 'Alice Mordenti', image: '', rating: 1500 },
            { name: 'Bianchetta Lacusta', image: '', rating: 1500 },
            { name: 'Rachele Santoro', image: '', rating: 1500 },
            { name: 'Martina Rossi', image: '', rating: 1500 },
            { name: 'Francesca Cuccuru', image: '', rating: 1500 },
            { name: 'Camilla Boccignoni', image: '', rating: 1500 },
            { name: 'Sara Esposito', image: '', rating: 1500 },
            { name: 'Samara Tramontana', image: '', rating: 1500 },
            { name: 'Noemi Piunti', image: '', rating: 1500 },
            { name: 'Coco Genge', image: '', rating: 1500 },
            { name: 'Viola Silvi', image: '', rating: 1500 },
            { name: 'Manila Chiarello', image: '', rating: 1500 },
            { name: 'Sofia Crisafulli', image: '', rating: 1500 },
            { name: 'Rebecca Parziale', image: '', rating: 1500 },
            { name: 'Claudia Dorelfi', image: '', rating: 1500 },
            { name: 'Giada Coletti', image: '', rating: 1500 },
            { name: 'Gaia Clerici', image: '', rating: 1500 },
            { name: 'Gaia Bianchi', image: '', rating: 1500 },
            { name: 'Valentina Clerici', image: '', rating: 1500 },
            { name: 'Chiara Casadei', image: '', rating: 1500 },
            { name: 'Sarah Toscano', image: '', rating: 1500 }
        ],
        scoreboard: [
            { name: 'Francesca Cuccuru', image: '', rating: 1500 },
            { name: 'Yasmine Barbieri', image: '', rating: 1500 },
            { name: 'Emily Pallini', image: '', rating: 1500 },
            { name: 'Alessia Lanza', image: '', rating: 1500 }
        ],
        image: ['https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg']
    }
];

// let polls = await getPollsFromDB();

export async function updatePoll(newPoll) {
    try {
        await updatePollInDb(newPoll);

        return newPoll;
    } catch (err) {
        console.error('Error updating poll', err);
    }
}

export async function getPoll(id) {
    const poll = await getPollFromDB(id);

    return poll;
}

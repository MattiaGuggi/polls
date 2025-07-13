import { getUsersFromDB, createUser, getUserFromDb } from './db.js';
const users = [
    { username: 'panda', name: 'Mattia', surname: 'Guggi', email: 'test@gmail.com', password: 'password123' }
];
// const users = await getUsersFromDB();

export async function authenticateUser(email, password) {
  return await getUserFromDb({ email, password })  || null;
}

export async function registerUser(name, email, password) {
  await createUser({ name, email, password });
}

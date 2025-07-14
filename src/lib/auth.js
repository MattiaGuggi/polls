import { createUserInDb, getUserFromDb, updateUserInDb } from './db.js';

export async function authenticateUser(email, password) {
  return await getUserFromDb({ email, password });
}

export async function registerUser(name, email, password) {
  await createUserInDb({ name, email, password });
}

export async function updateUser(user) {
  await updateUserInDb(user);
};

export async function getUser(id) {
  return await getUserFromDb({ _id: id });
};

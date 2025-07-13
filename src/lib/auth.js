// Simple in-memory user store for demonstration
const users = [
    { username: 'panda', name: 'Mattia', surname: 'Guggi', email: 'test@gmail.com', password: 'password123' }
];

export function authenticateUser(email, password) {
  return users.find(u => u.email === email && u.password === password) || null;
}

export function registerUser(name, email, password) {
  if (users.find(u => u.email === email)) return null;
  const user = { name, email, password };
  users.push(user);
  return user;
}

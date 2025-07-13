// Simple in-memory user store for demonstration
const users = [
    { name: 'Mattia Guggi', email: 'mattiahag@gmail.com', password: 'mattiaha2006' }
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

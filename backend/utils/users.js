import bcrypt from "bcrypt";

const users = [
  {
    id: 1,
    username: "admin",
    passwordHash: await bcrypt.hash("admin123", 10), // Simulasi penyimpanan password yang sudah di-hash
  },
];

export const findUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};

export const validatePassword = async (plainPassword, hash) => {
  return bcrypt.compare(plainPassword, hash);
};

export const addUser = async (username, password) => {
  const existing = findUserByUsername(username);
  if (existing) {
    throw new Error("Username sudah terdaftar");
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    passwordHash: hashed,
  };
  users.push(newUser);
  return newUser;
};

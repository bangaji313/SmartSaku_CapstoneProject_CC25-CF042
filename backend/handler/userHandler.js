import { generateToken } from "../utils/token.js";
import { addUser, findUserByUsername, validatePassword } from "../utils/users.js";

export const loginHandler = async (request, h) => {
  const { username, password } = request.payload;

  const user = findUserByUsername(username);
  if (!user) {
    return h.response({ message: "User tidak ditemukan" }).code(401);
  }

  const isValid = await validatePassword(password, user.passwordHash);
  if (!isValid) {
    return h.response({ message: "Password salah" }).code(401);
  }

  const token = generateToken(user);

  return h.response({
    message: "Login berhasil",
    token,
  });
};

export const registerHandler = async (request, h) => {
  const { username, password } = request.payload;

  try {
    const newUser = await addUser(username, password);

    return h
      .response({
        message: "Registrasi berhasil",
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        message: error.message,
      })
      .code(400);
  }
};

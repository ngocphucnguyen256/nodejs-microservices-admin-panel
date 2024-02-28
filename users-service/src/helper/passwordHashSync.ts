import bcrypt from "bcryptjs";

const passwordHashSync = (password : string) =>
  bcrypt.hashSync(password, 10);

export default passwordHashSync;
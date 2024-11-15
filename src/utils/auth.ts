import bcrypt from 'bcryptjs';

const saltAndHashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const compareHashAndPassword = async (hash: string, password: string) => {
  return await bcrypt.compare(password, hash);
};

export { saltAndHashPassword, compareHashAndPassword };

import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const hashedResult = await bcrypt.hash(password, 10);
  return hashedResult;
}

export async function doesPasswordMatchHash(hash: string, password: string) {
  const isMatched = await bcrypt.compare(password, hash);
  return isMatched;
}

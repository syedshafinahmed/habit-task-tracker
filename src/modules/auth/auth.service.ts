import bcrypt from "bcryptjs";
import prisma from "../../config/db";
import { signToken } from "../../utils/jwt";

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerService = async (input: RegisterInput) => {
  const { email, password, name } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error: any = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return { user, token };
};

export const loginService = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); // bcrypt.compare hashes the incoming plain text password and compares it to the stored hash

  if (!isPasswordValid) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ userId: user.id, email: user.email });

  const { password: _, ...userWithoutPassword } = user; // destructuring to strip the password field out

  return { user: userWithoutPassword, token };
};

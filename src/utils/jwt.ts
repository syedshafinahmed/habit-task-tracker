import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

export interface JwtPayload {
  userId: string;
  email: string;
}

export const signToken = (payload: JwtPayload): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as unknown as number,
    });
  } catch (err) {
    throw new Error(`Failed to sign token: ${(err as Error).message}`);
  }
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    throw new Error(`Invalid or expired token: ${(err as Error).message}`);
  }
};

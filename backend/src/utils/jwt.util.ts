import jwt from "jsonwebtoken";
import type { SignOptions, Secret } from "jsonwebtoken";
import { TOKEN_EXPIRY } from "../constants/auth.constants.js";
import type { JWTPayload } from "../types/auth.types.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const secretKey = process.env.JWT_SECRET || '';
const expiresIn = TOKEN_EXPIRY.ACCESS_TOKEN || '15m'; // Default to 15 minutes if not set

export const generateAccessToken = (payload: any) => {
  return jwt.sign(
    payload, secretKey as Secret,
    { expiresIn: expiresIn } as SignOptions
  );
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey as Secret);
    return decoded as JWTPayload;
  } catch (error: any) {
    throw new Error("Invalid token");
  }
};
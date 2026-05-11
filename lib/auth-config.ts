import { getEnv } from "./env";

export const JWT_SECRET = new TextEncoder().encode(getEnv().AUTH_SECRET);

import * as dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI', 'AUTH_API', 'DATA_API', 'PROVIDERS'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const CLIENT_ID: string = process.env.CLIENT_ID!;
export const CLIENT_SECRET: string = process.env.CLIENT_SECRET!;
export const REDIRECT_URI: string = process.env.REDIRECT_URI!;
export const AUTH_API: string = process.env.AUTH_API!;
export const DATA_API: string = process.env.DATA_API!;
export const PROVIDERS: string = process.env.PROVIDERS!;
export const SCOPE: string = process.env.SCOPE!;
export const AUTH_URL = `https://${AUTH_API}`;
export const TOKEN_URL = `https://${AUTH_API}/connect/token`;
export const DATA_URL = `https://${DATA_API}/data/v1`;

export const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN!;
export const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;

export const DB_NAME: string = process.env.DB_NAME!;
export const DB_USER: string = process.env.DB_USER!;
export const DB_PASSWORD: string = process.env.DB_PASSWORD!;
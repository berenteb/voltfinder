import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const FIREBASE_PROJECT_ID = env.get('FIREBASE_PROJECT_ID').required().asString();
export const FIREBASE_CLIENT_EMAIL = env.get('FIREBASE_CLIENT_EMAIL').required().asString();
export const FIREBASE_PRIVATE_KEY = env.get('FIREBASE_PRIVATE_KEY').required().asString();
export const FRONTEND_URL = env.get('FRONTEND_URL').required().asString();

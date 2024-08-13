import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const FIREBASE_API_KEY = env.get('NEXT_PUBLIC_FIREBASE_API_KEY').required().asString();
export const FIREBASE_PROJECT_ID = env.get('NEXT_PUBLIC_FIREBASE_PROJECT_ID').required().asString();
export const FIREBASE_AUTH_DOMAIN = env.get('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN').required().asString();
export const FIREBASE_STORAGE_BUCKET = env.get('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET').required().asString();
export const FIREBASE_MESSAGING_SENDER_ID = env.get('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID').required().asString();
export const FIREBASE_APP_ID = env.get('NEXT_PUBLIC_FIREBASE_APP_ID').required().asString();
export const ANALYTICS_ID = env.get('NEXT_PUBLIC_ANALYTICS_ID').required().asString();
export const FIREBASE_VAPID_KEY = env.get('NEXT_PUBLIC_FIREBASE_VAPID_KEY').required().asString();

export const BACKEND_URL = env.get('NEXT_PUBLIC_BACKEND_URL').required().asString();

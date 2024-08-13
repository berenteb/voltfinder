const esbuild = require('esbuild');
const dotenv = require('dotenv');
const env = require('env-var');

dotenv.config();

const FIREBASE_API_KEY = env.get('NEXT_PUBLIC_FIREBASE_API_KEY').asString();
const FIREBASE_AUTH_DOMAIN = env.get('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN').asString();
const FIREBASE_PROJECT_ID = env.get('NEXT_PUBLIC_FIREBASE_PROJECT_ID').asString();
const FIREBASE_STORAGE_BUCKET = env.get('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET').asString();
const FIREBASE_MESSAGING_SENDER_ID = env.get('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID').asString();
const FIREBASE_APP_ID = env.get('NEXT_PUBLIC_FIREBASE_APP_ID').asString();
const ANALYTICS_ID = env.get('NEXT_PUBLIC_ANALYTICS_ID').asString();

esbuild
  .build({
    entryPoints: ['src/public/*'],
    outdir: 'public',
    bundle: true,
    minify: true,
    define: {
      'process.env.NEXT_PUBLIC_FIREBASE_API_KEY': `"${FIREBASE_API_KEY}"`,
      'process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': `"${FIREBASE_AUTH_DOMAIN}"`,
      'process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID': `"${FIREBASE_PROJECT_ID}"`,
      'process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': `"${FIREBASE_STORAGE_BUCKET}"`,
      'process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': `"${FIREBASE_MESSAGING_SENDER_ID}"`,
      'process.env.NEXT_PUBLIC_FIREBASE_APP_ID': `"${FIREBASE_APP_ID}"`,
      'process.env.NEXT_PUBLIC_ANALYTICS_ID': `"${ANALYTICS_ID}"`,
    },
  })
  .catch(() => process.exit(1));

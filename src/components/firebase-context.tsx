'use client';

import { initializeApp } from '@firebase/app';
import { getMessaging, getToken, Messaging } from '@firebase/messaging';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import {
  ANALYTICS_ID,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_VAPID_KEY,
} from '@/config/frontend-env.config';

type FirebaseContextType = {
  token?: string;
};

const FirebaseContext = createContext<FirebaseContextType>({});

export function FirebaseProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string>();

  const register = (messaging: Messaging) => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: FIREBASE_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              setToken(currentToken);
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      }
    });
  };

  const initializeFirebase = () => {
    const firebaseConfig = {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID,
      measurementId: ANALYTICS_ID,
    };
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    register(messaging);
  };

  useEffect(() => {
    initializeFirebase();
  }, []);

  return <FirebaseContext.Provider value={{ token }}>{children}</FirebaseContext.Provider>;
}

export function useFirebase(): FirebaseContextType {
  if (!FirebaseContext) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return useContext(FirebaseContext);
}

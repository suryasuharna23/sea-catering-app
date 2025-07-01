"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const FirebaseContext = createContext();

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      const firebaseConfig = typeof __firebase_config !== 'undefined'
        ? JSON.parse(__firebase_config)
        : {};

      const initializedApp = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(initializedApp);
      const firebaseAuth = getAuth(initializedApp);

      setApp(initializedApp);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          const anonymousUser = await signInAnonymously(firebaseAuth);
          setUserId(anonymousUser.user.uid);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setIsAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (auth && typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      signInWithCustomToken(auth, __initial_auth_token)
        .then((userCredential) => {
          setUserId(userCredential.user.uid);
        })
        .catch((error) => {
          console.error("Custom token sign-in failed:", error);
          signInAnonymously(auth)
            .then((userCredential) => setUserId(userCredential.user.uid))
            .catch((anonError) => console.error("Anonymous sign-in failed:", anonError));
        });
    } else if (auth && !userId && !isAuthReady) {
      signInAnonymously(auth)
        .then((userCredential) => setUserId(userCredential.user.uid))
        .catch((error) => console.error("Anonymous sign-in failed:", error));
    }
  }, [auth, userId, isAuthReady]);

  return (
    <FirebaseContext.Provider value={{ app, db, auth, userId, isAuthReady }}>
      {children}
    </FirebaseContext.Provider>
  );
};

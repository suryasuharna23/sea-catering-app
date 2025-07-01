"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Import getApps dan getApp
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const FirebaseContext = createContext();

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isFirstAuthCheck = useRef(true);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        let firebaseConfig;
        let appIdFromEnv = 'default-app-id';

        // Prioritaskan konfigurasi dari lingkungan Canvas
        if (typeof __firebase_config !== 'undefined' && Object.keys(JSON.parse(__firebase_config)).length > 0) {
          firebaseConfig = JSON.parse(__firebase_config);
          appIdFromEnv = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.projectId;
        } else {
          // Jika tidak di lingkungan Canvas, baca dari variabel lingkungan lokal
          firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
          };
          appIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-app-id';
        }

        if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
          console.error("Konfigurasi Firebase hilang atau tidak lengkap. Pastikan apiKey, projectId, dan appId ada.");
          setIsAuthReady(true);
          return;
        }

        // Inisialisasi Firebase hanya jika belum ada instance yang berjalan
        const currentApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const firestoreDb = getFirestore(currentApp);
        const firebaseAuth = getAuth(currentApp);

        setApp(currentApp);
        setDb(firestoreDb);
        setAuth(firebaseAuth);

        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          try {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } catch (error) {
            console.error("Masuk dengan token kustom gagal:", error);
          }
        }

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (isFirstAuthCheck.current) {
            isFirstAuthCheck.current = false;

            if (user) {
              setUserId(user.uid);
              const userDocRef = doc(firestoreDb, `artifacts/${appIdFromEnv}/users/${user.uid}`);
              try {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                  setUserRole(userDocSnap.data().role || 'user');
                } else {
                  await setDoc(userDocRef, {
                    email: user.email || '',
                    fullName: user.displayName || '',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                  }, { merge: true });
                  setUserRole('user');
                }
              } catch (docError) {
                console.error("Kesalahan mengambil atau membuat peran pengguna di DB:", docError);
                setUserRole('user');
              }
            } else {
              try {
                const anonymousUser = await signInAnonymously(firebaseAuth);
                setUserId(anonymousUser.user.uid);
                setUserRole('guest');
              } catch (anonError) {
                console.error("Kesalahan saat masuk secara anonim:", anonError);
                setUserId(null);
                setUserRole(null);
              }
            }
            setIsAuthReady(true);
          } else {
            if (user) {
              setUserId(user.uid);
              const userDocRef = doc(firestoreDb, `artifacts/${appIdFromEnv}/users/${user.uid}`);
              try {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                  setUserRole(userDocSnap.data().role || 'user');
                } else {
                  setUserRole('user');
                }
              } catch (docError) {
                console.error("Kesalahan mengambil peran pengguna di DB:", docError);
                setUserRole('user');
              }
            } else {
              setUserId(null);
              setUserRole('guest');
            }
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Kesalahan inisialisasi Firebase kritis:", error);
        setIsAuthReady(true);
      }
    };

    initFirebase();
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, db, auth, userId, userRole, isAuthReady }}>
      {children}
    </FirebaseContext.Provider>
  );
};

"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('[AuthContext] onAuthStateChanged:', user ? user.email : 'no user');
            setUser(user);
            setLoading(false);
        });

        console.log('[AuthContext] Checking for redirect result...');
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log('[AuthContext] Google login successful via redirect:', result.user.email);
                } else {
                    console.log('[AuthContext] No redirect result found');
                }
            })
            .catch((error) => {
                console.error('[AuthContext] Redirect result error:', {
                    code: error.code,
                    message: error.message
                });
            });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, displayName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(result.user, { displayName });
        }
        return result;
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error('[AuthContext] Google login error:', {
                code: error.code,
                message: error.message,
                details: error
            });
            throw error;
        }
    };

    const logout = async () => {
        return signOut(auth);
    };

    const value = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

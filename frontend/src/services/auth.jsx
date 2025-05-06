import { auth } from '../firebase'; // Corrected import path
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

export const register = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    const token = await userCredential.user.getIdToken();
    const response = await fetch('http://localhost:8000/api/verify-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync with backend');
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '@/types/scientific';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Usuario autenticado - cargar datos del usuario desde Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || userData.name || '',
              affiliation: userData.affiliation || '',
              orcidId: userData.orcidId || '',
              googleScholarId: userData.googleScholarId || '',
              researchInterests: userData.researchInterests || [],
              createdAt: userData.createdAt || new Date(),
              updatedAt: new Date(),
            });
          } else {
            // Usuario nuevo - crear documento en Firestore
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              affiliation: '',
              researchInterests: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser(null);
        }
      } else {
        // Usuario no autenticado
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // El estado se actualizará automáticamente via onAuthStateChanged
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Actualizar perfil de Firebase Auth
      if (userData.name) {
        await updateProfile(firebaseUser, {
          displayName: userData.name
        });
      }

      // Crear documento de usuario en Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || '',
        affiliation: userData.affiliation || '',
        orcidId: userData.orcidId || '',
        googleScholarId: userData.googleScholarId || '',
        researchInterests: userData.researchInterests || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      // El estado se actualizará automáticamente via onAuthStateChanged
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // El estado se actualizará automáticamente via onAuthStateChanged
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!firebaseUser || !user) return;

    try {
      // Actualizar Firestore
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        updatedAt: new Date(),
      });

      // Actualizar Firebase Auth si hay cambios en el nombre
      if (userData.name && userData.name !== firebaseUser.displayName) {
        await updateProfile(firebaseUser, {
          displayName: userData.name
        });
      }

      // Actualizar estado local
      setUser(prev => prev ? { ...prev, ...userData, updatedAt: new Date() } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Función helper para mensajes de error más amigables
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No se encontró una cuenta con este correo electrónico.';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este correo electrónico.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta más tarde.';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu internet.';
    default:
      return 'Error de autenticación. Intenta nuevamente.';
  }
}


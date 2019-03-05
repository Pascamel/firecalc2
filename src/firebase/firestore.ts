import { auth, firestore } from './firebase';

// Users

export const getUser = (uid: string) => firestore.collection('users').doc(uid).get();
export const getUsers = () => firestore.collection('users').get();
export const getCurrentUserUID = () => auth.currentUser ? auth.currentUser : '';
export const setUser = (uid: string, data: any) => firestore.collection('users').doc(uid).set(data);

// Finance

export const getHeaders = () => {
  if (!auth.currentUser) return null;
  return firestore.collection('headers').doc(auth.currentUser.uid).get();
}

export const getRevenues = () => {
  if (!auth.currentUser) return null;
  return firestore.collection('income').doc(auth.currentUser.uid).get();
}

export const getSavings = () => {
  if (!auth.currentUser) return null;
  return firestore.collection('savings').doc(auth.currentUser.uid).get();
}

export const setHeaders = (data: any) => {
  if (!auth.currentUser) return;
  firestore.collection('headers').doc(auth.currentUser.uid).set(data);
}

export const setRevenues = (data: any) => {
  if (!auth.currentUser) return;
  firestore.collection('income').doc(auth.currentUser.uid).set(data);
}

export const setSavings = (data: any) => {
  if (!auth.currentUser) return;
  firestore.collection('savings').doc(auth.currentUser.uid).set(data);
}
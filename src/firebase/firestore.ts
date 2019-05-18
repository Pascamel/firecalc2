import { auth, firestore } from './firebase';

// Users

export const getUser = (uid: string) => firestore.collection('users').doc(uid).get();
export const getUsers = () => firestore.collection('users').get();
export const getCurrentUserUID = () => auth.currentUser ? auth.currentUser.uid : '';
export const setUser = (uid: string, data: any) => firestore.collection('users').doc(uid).set(data);

// Finance

export const getHeaders = (uid: string) => firestore.collection('headers').doc(uid).get();
export const getRevenues = (uid: string) => firestore.collection('income').doc(uid).get();
export const getSavings = (uid: string) => firestore.collection('savings').doc(uid).get();
export const getOthers = (uid: string) => firestore.collection('others').doc(uid).get();

export const setHeaders = (uid: string, data: any) => firestore.collection('headers').doc(uid).set(data);
export const setRevenues = (uid: string, data: any) => firestore.collection('income').doc(uid).set(data);
export const setSavings = (uid: string, data: any) => firestore.collection('savings').doc(uid).set(data)
export const setOthers = (uid: string, data: any) => firestore.collection('others').doc(uid).set(data);

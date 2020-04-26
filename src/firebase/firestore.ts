// import { firestore as firestoreAdmin } from 'firebase-admin';
import firebase from 'firebase/app';

import { IEvent } from '../store/journal';
import { auth, firestore } from './firebase';

// Users

export const getUser = (uid: string) =>
  firestore.collection('users').doc(uid).get();
export const getUsers = () => firestore.collection('users').get();
export const getCurrentUserUID = () =>
  auth.currentUser ? auth.currentUser.uid : '';
export const setUser = (uid: string, data: any) =>
  firestore.collection('users').doc(uid).set(data);

// Finance

export const getHeaders = (uid: string) => {
  return firestore.collection('headers').doc(uid).get();
};

export const getRevenues = (uid: string) => {
  return firestore.collection('income').doc(uid).get();
};

export const getSavings = (uid: string) => {
  return firestore.collection('savings').doc(uid).get();
};

export const getExpenses = (uid: string) => {
  return firestore.collection('expenses').doc(uid).get();
};

export const getOthers = (uid: string) => {
  return firestore.collection('others').doc(uid).get();
};

export const setHeaders = (uid: string, data: any) => {
  return firestore.collection('headers').doc(uid).set(data);
};

export const setRevenues = (uid: string, data: any) => {
  return firestore.collection('income').doc(uid).set(data);
};

export const setSavings = (uid: string, data: any) => {
  return firestore.collection('savings').doc(uid).set(data);
};

export const setExpenses = (uid: string, data: any) => {
  return firestore.collection('expenses').doc(uid).set(data);
};

export const setOthers = (uid: string, data: any) => {
  return firestore.collection('others').doc(uid).set(data);
};

// journal

export const getJournal = (uid: string) => {
  return firestore.collection('journal').doc(uid).get();
};

export const pushJournal = (event: IEvent) => {
  const uid = firebase.auth().currentUser?.uid;
  if (!uid) {
    return;
  }

  var journal = firestore.collection('journal').doc(uid);

  journal.get().then((snapshot) => {
    if (snapshot.exists) {
      journal.update({
        last_update: new Date().getTime(),
        events: firebase.firestore.FieldValue.arrayUnion(event),
      });
    } else {
      journal.set({
        last_update: new Date().getTime(),
        events: [event],
      });
    }
  });
};

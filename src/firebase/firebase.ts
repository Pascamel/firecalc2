import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';


// REACT_APP_API_KEY=
// REACT_APP_AUTH_DOMAIN=
// REACT_APP_DATABASE_URL=
// REACT_APP_PROJECT_ID=
// REACT_APP_STORAGE_BUCKET=
// REACT_APP_MESSAGING_SENDER_ID=

const config = {
  // apiKey: "AIzaSyBQs6yJ2euReTS-aTua1KDKGdm0bLeCRO0",
  // authDomain: "firecalculator-6b0f6.firebaseapp.com",
  // databaseURL: "https://firecalculator-6b0f6.firebaseio.com",
  // messagingSenderId: "816782235195",
  // projectId: "YOUR firecalculator-6b0f6",
  // storageBucket: "firecalculator-6b0f6.appspot.com"
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const db = firebase.database();
export const firestore = firebase.firestore();

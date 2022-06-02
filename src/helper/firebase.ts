require('dotenv').config();

import firebase from 'firebase-admin';
var serviceAccount = require('../service-account.json');

export default firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
})
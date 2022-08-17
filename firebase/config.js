import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB6BgwUj-mMsCv7QDqlF7byeKzxFXSwow0",
  authDomain: "opwa-productions.firebaseapp.com",
  projectId: "opwa-productions",
  storageBucket: "opwa-productions.appspot.com",
  messagingSenderId: "528319511978",
  appId: "1:528319511978:web:51ec545236d910aa38ffd3"
}

// firebase init
initializeApp(firebaseConfig)

// init service
const db = getFirestore()
const auth = getAuth()

export { db, auth }

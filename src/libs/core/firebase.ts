// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getStorage, ref } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVLDCA6PuI02T7vC2K8_Czvu8RrwDBV9o",
  authDomain: "user-e8717.firebaseapp.com",
  databaseURL: "https://user-e8717.firebaseio.com",
  projectId: "user-e8717",
  storageBucket: "user-e8717.appspot.com",
  messagingSenderId: "160842378884",
  appId: "1:160842378884:web:0e17dbe94496c343e59cd1",
  measurementId: "G-TQBNYZ5DJB"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const cloudStorage = getStorage(app)
export const getQuizStorageRef = (postLocation: string = '') => ref(cloudStorage, `/quiz-file-upload${postLocation ? `/${postLocation}` : ''}`)

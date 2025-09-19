
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWX3qmBfKjNxHBbauYvSneZ5Sn0LxJAM8",
  authDomain: "week-zihanzhang.firebaseapp.com",
  projectId: "week-zihanzhang",
  storageBucket: "week-zihanzhang.firebasestorage.app",
  messagingSenderId: "224568996906",
  appId: "1:224568996906:web:116e0376810224db9a7f53"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

const vueApp = createApp(App)
vueApp.use(router)
vueApp.mount('#app')

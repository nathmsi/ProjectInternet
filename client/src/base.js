import Rebase from 're-base'
import firebase from 'firebase/app'
import 'firebase/database'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBrs5p5essJ6tNqxR5V7K6o1pVTPeDAatY  a",
    authDomain: "recette-app-be9dd.firebaseapp.com",
    databaseURL: "https://recette-app-be9dd.firebaseio.com"
})

const base = Rebase.createClass(firebaseApp.database())

// This is a named export
export { firebaseApp }

// this is a default export
export default base

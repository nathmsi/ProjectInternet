//import Rebase from 're-base'
import firebase from 'firebase/app'
import 'firebase/database'


let firebaseAccess = null


const firebaseApp = () => {
    try {
        console.log('firebase function ')
        if ( firebaseAccess === null ){
            firebaseAccess = firebase.initializeApp({
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTHDOMAIN,
            databaseURL: process.env.REACT_APP_DATABASEURL
        })
        }
        return firebaseAccess
    }
    catch (err) {
        console.log(err)
        return  'error'
    }
}




//const base = Rebase.createClass(firebaseApp.database())

// This is a named export
export { firebaseApp }

// this is a default export
//export default base


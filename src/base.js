//import Rebase from 're-base'
import firebase from 'firebase/app'
import 'firebase/database'





const firebaseApp = () => {
    try {
        console.log('firebase function ')
        return firebase.initializeApp({
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTHDOMAIN,
            databaseURL: process.env.REACT_APP_DATABASEURL
        })
    }
    catch (err) {
        console.log(err)
        return 'error'
    }
}




//const base = Rebase.createClass(firebaseApp.database())

// This is a named export
export { firebaseApp }

// this is a default export
//export default base


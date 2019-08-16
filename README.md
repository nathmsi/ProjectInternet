# ProjectInternet


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Then an Express server was added in the `server` directory. The server is proxied via the `proxy` key in `package.json`.



Clone the project, change into the directory and install the dependencies.

```
git clone https://github.com/nathmsi/ProjectInternet.git
cd ProjectInternet
npm install
```

Create a `.env` file for environment variables in your server. 

### Firebase 
REACT_APP_API_KEY=*******************************  /n
REACT_APP_AUTHDOMAIN=******************************* 
REACT_APP_DATABASEURL=*******************************

### paypal 
REACT_APP_PAYPAL_CLIENT_ID_SANDBOX=*******************************
REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION=*******************************

###  gmail
KEY_GMAIL=*******************************


You can start the server on its own with the command:

```
npm run server
```

Run the React application on its own with the command:

```
npm start
```

Run both applications together with the command:

```
npm run dev
```

The React application will run on port 3000 and the server port 3001.

## React Twilio starter

The [twilio branch](https://github.com/philnash/react-express-starter/tree/twilio) is a similar setup but also provides endpoints with basic [Access Tokens](https://www.twilio.com/docs/iam/access-tokens) for [Twilio Programmable Chat](https://www.twilio.com/docs/chat) and [Twilio Programmable Video](https://www.twilio.com/docs/video). You can use the project as a base for building React chat or video applications.

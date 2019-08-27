import 'bootstrap/dist/css/bootstrap.min.css'
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
// import AlertTemplate from 'react-alert-template-basic'

import AlertTemplate from './components/screen/AlertTemplate'

import "./index.css";

// optional cofiguration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 2500,
  offset: '20px',
  transition: transitions.FADE
}


ReactDOM.render(
  <BrowserRouter>
    <AlertProvider template={AlertTemplate} {...options} >
      <App />
    </AlertProvider>
  </BrowserRouter>
  ,
  document.getElementById("root")
);
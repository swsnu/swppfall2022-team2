import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { combineReducers, createStore } from 'redux';
import reducers from './store/reducers';
import { store } from './store';



const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const persistor = persistStore(store)
axios
  .get(`/chat/token/`)
  .then(() => {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  })
  .catch(() => {});


root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor = {persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


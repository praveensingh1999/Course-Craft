import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from "react-redux";
import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./reducer";
 

const store = configureStore({
  reducer:rootReducer,
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    
  </StrictMode>,
)

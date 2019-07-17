import {combineReducers} from 'redux';
import authReducer from './authReducer'




export default combineReducers ({
   auth: authReducer,                   // auth is container in store in which authReducer store in
                   
})
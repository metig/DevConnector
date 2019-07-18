import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from  './errorReducer';



export default combineReducers ({
   auth: authReducer,                   // auth is container in store in which authReducer store in
   errors: errorReducer                
})
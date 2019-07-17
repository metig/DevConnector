import {TEST_DISPATCH} from '../actions/types';

const initialState ={
    isAuthenticated: false,
    user: {}
};



export default function(state = initialState, action) {
    switch(action.type){                           // switch is if statement simplified form
        case TEST_DISPATCH:
            return {
                ...state,
                user: action.payload
            }


        default:                                   // else
          return state;
    }
 }
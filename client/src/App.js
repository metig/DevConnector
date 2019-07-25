import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import {Provider} from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, logoutUser } from './actions/authActions';
import setAuthToken from './utils/setAuthtoken';

  //Check for token
if (localStorage.jwtToken){
  // Set auth token header
setAuthToken(localStorage.jwtToken);
  // Decode
const decoded = jwt_decode (localStorage.jwtToken);
  // Set user isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //Check for expires token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // logout user
    store.dispatch(logoutUser());

    //clear current profile

    // Redirect the user to login
    window.location.href = '/login';
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
      <div className="App">
        <Navbar /> 
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login} />
        </div>
        <Footer />
      </div>
      </Router>
    </Provider>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import UserForm  from '../components/UserForm.jsx';
import '../styles/LoginSignup.module.css'; // imports styles for login page

const Login = () => {

  return (
    <div className="login">
      <UserForm action='verifyAccount' />
      <Link to='/signup'>Not a user sign up</Link>
    </div>
  )
}

export default Login;
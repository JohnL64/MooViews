import React from 'react';
import { Link } from 'react-router-dom';
import UserForm  from '../components/UserForm.jsx';
import css from '../styles/LoginSignup.module.css'; // imports styles for login page

const Login = () => {

  return (
    <div className={css.userForm}>
      <UserForm action='verifyAccount' />
    </div>
  )
}

export default Login;
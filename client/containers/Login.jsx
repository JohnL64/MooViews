import React, { useEffect } from 'react';
import UserForm  from '../components/UserForm.jsx';
import css from '../styles/LoginSignup.module.css'; // imports styles for login page

const Login = () => {
  document.body.style.backgroundColor = 'white';

  return (
    <div className={css.userForm}>
      <UserForm action='verifyAccount' />
    </div>
  )
}

export default Login;
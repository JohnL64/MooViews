import React, { useEffect } from 'react';
import UserForm  from '../components/UserForm.jsx';
import css from '../styles/LoginSignup.module.css'; // imports styles for login page

const Login = ({ setValidatedUser, resetNavbar }) => {
  document.body.style.backgroundColor = 'white';
  document.title = 'MooViews Sign-In';

  useEffect(() => {
    resetNavbar();
  }, []);

  return (
    <div className={css.userForm}>
      <UserForm action='verifyAccount' setValidatedUser={setValidatedUser} />
    </div>
  )
}

export default Login;
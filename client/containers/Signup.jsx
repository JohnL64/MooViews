import React from 'react';
import UserForm from '../components/UserForm.jsx';
import css from '../styles/LoginSignup.module.css';

const Signup = () => {
  return (
    <div className={css.userForm}>
      <UserForm action='createAccount' />
    </div>
  );
}
 
export default Signup;
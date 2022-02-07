import React, { useEffect } from 'react';
import UserForm from '../components/UserForm.jsx';
import css from '../styles/LoginSignup.module.css';

const Signup = ({ resetNavbar }) => {
  document.body.style.backgroundColor = 'white';
  document.title = 'MooViews Registration';

  useEffect(() => {
    resetNavbar();
  }, []);

  return (
    <div className={css.userForm}>
      <UserForm action='createAccount' />
    </div>
  );
}
 
export default Signup;
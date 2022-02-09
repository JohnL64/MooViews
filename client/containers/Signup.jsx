import React, { useEffect } from 'react';
import UserForm from '../components/UserForm.jsx';
import css from '../styles/LoginSignup.module.css';

const Signup = ({ setValidatedUser, resetNavbar }) => {
  document.body.style.backgroundColor = 'white';
  document.title = 'MooViews Registration';

  useEffect(() => {
    resetNavbar();
  }, []);

  return (
    <div className={css.userForm}>
      <UserForm action='createAccount' setValidatedUser={setValidatedUser}/>
    </div>
  );
}
 
export default Signup;
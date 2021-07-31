import React from 'react';
import UserForm from '../components/UserForm.jsx';
import '../styles/LoginSignup.module.css';

const Signup = () => {
  return (
    <div className="signup">
      <UserForm action='createAccount' />
    </div>
  );
}
 
export default Signup;
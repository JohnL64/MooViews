import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import css from '../styles/LoginSignup.module.css';
import { Link } from 'react-router-dom';

const UserForm = ({ action, setValidatedUser}) => {
  // Using state to track possible errors when verifying or creating an account. If an error occurs this state will store the error and render it to the page
  const [userError, setUserError] = useState('');
  // Using state to store user inputted email, username, and password to display changes to the correct input field and to send user data to server.
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')

  // Created variables and conditional statements to dynamically render the form title and the text inside the button
  let formTitle;
  let submitButton;
  if (action === 'verifyAccount') {
    formTitle = 'Sign In To Account';
    submitButton = 'Log In';
  }
  else {
    formTitle = 'Create An Account';
    submitButton = 'Sign Up';
  }

  // Method used to navigate to a different react route (container component)
  const history = useHistory();

  // Method invoked when login/signup button is clicked
  const validAccount = (e) => {
    e.preventDefault();
    // makes requests to the server to create or verify accounts. If succesful redirect to Movies page
    fetch(`/user/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, username, password })
    })
    .then(res => res.json())
    .then(data => {
      // if error occurs on the server side run code in catch method
      if (data.errorType) throw new Error('Error', { cause: data.errorType });
      if (action === 'verifyAccount') {
        setValidatedUser(true);
        history.goBack('/');
      } else history.push('/login');
    })
    .catch(err => {
      // if an err has occurred update userError to the given cause to be displayed
      setUserError(err.cause);
      // clear input fields when error occurs
      setUsername('');
      setPassword('');
    })
  }

  return (
    <div className={css.outerForm}>
      <h1>{formTitle}</h1>
      <form className={css.innerForm} onSubmit={validAccount}>
        { action === 'createAccount' && <input type='email' id="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} /> }
        <input type='text' id="username" required value={username} placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
        <input type='password' id="password" required value={password} placeholder='Password'  onChange={(e) => setPassword(e.target.value)} />
        <button id={css.submitBtn}>{submitButton}</button>
      </form>
      { userError && <p>{userError}</p>}
      { action === 'verifyAccount' && <p className={css.loginSignupLink}>Dont have an account? <Link to='/signup'>Sign Up</Link></p> }
      { action === 'createAccount' && <p className={css.loginSignupLink}>Have an account? <Link to='/login'>Log In</Link></p> }
    </div>
  )
}

export default UserForm;
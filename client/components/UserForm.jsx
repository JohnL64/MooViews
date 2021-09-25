import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import css from '../styles/LoginSignup.module.css';
import { Link } from 'react-router-dom';

const UserForm = ({ action }) => {
  // useError to store and track the possible error when verifying or creating account. useError is used to display the error message received from the database
  const [userError, setUserError] = useState('');
  // email, username, password are used to save and dipslay user inputs in given fields. Also used when sending data to server
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  // history is used to be able to navigate to different pages in the application
  const history = useHistory();

  // method invoked when button in form is clicked
  const validAccount = (e) => {
    e.preventDefault();
    // makes requests to the server to create or verify accounts
    fetch(`/user/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, username, password })
    })
    .then(res => {
      return res.json()
    })
    .then(data => {
      // if incoming data from the response has a errorType property throw error where the second argument will be an object with the default cause property and its value being the value saved in the errorType prop in the response object
      if (data.errorType) throw new Error('Error', { cause: data.errorType });
      // when errorType prop is absent which means the creation or verfication of an account was successful redirect user to the home page
      history.push('/');
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
      { action === 'verifyAccount' && <h1>Sign In To Account</h1> }
      { action === 'createAccount' && <h1>Create An Account</h1> }
      <form className={css.innerForm} onSubmit={validAccount}>
        { action === 'createAccount' && <input type='email' id="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} /> }
        <input type='text' id="username" required value={username} placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
        <input type='password' id="password" required value={password} placeholder='Password'  onChange={(e) => setPassword(e.target.value)} />
        { action === 'createAccount' && <button id={css.submitBtn}>Sign Up</button> }
        { action === 'verifyAccount' && <button id={css.submitBtn}>Log In</button> }
      </form>
      { userError && <p>{userError}</p>}
      { action === 'verifyAccount' && <p className={css.loginSignupLink}>Dont have an account? <Link to='/signup'>Sign Up</Link></p> }
      { action === 'createAccount' && <p className={css.loginSignupLink}>Have an account? <Link to='/login'>Log In</Link></p> }
    </div>
  )
}

export default UserForm;
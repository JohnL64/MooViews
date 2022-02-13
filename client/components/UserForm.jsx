import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import css from '../styles/LoginSignup.module.css';
import { Link } from 'react-router-dom';
import { IoAlertCircleSharp } from 'react-icons/io5';

const UserForm = ({ action, setValidatedUser }) => {
  // Using state to store user inputted email, username, and password to display changes to the correct input field and to send user data to server.
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  // Using state to track possible errors when verifying or creating an account. If an error occurs this state will store the error and render it to the page
  const [userError, setUserError] = useState('');

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

  const abortCont = new AbortController;

  useEffect(() => {
    return () => abortCont.abort();
  })

  // Method invoked when login/signup button is clicked
  const validAccount = (e) => {
    e.preventDefault();
    // makes requests to the server to create or verify accounts. If succesful redirect to Movies page
    if (action === 'verifyAccount' || (action === 'createAccount' && password === confirmPW)) {
      fetch(`/user/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email, username, password }),
        signal: abortCont.signal
      })
      .then(res => res.json())
      .then(data => {
        // if error occurs on the server side run code in catch method
        if (data.errorType) throw new Error('Error', { cause: data.errorType });
        setValidatedUser(true);
        history.push(sessionStorage.getItem('lastPage'));
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch Aborted in UserForm!!!')
        } else {
          // if an err has occurred update userError to the given cause to be displayed
          setUserError(err.cause);
          // clear input fields when error occurs
          setUsername('');
          setPassword('');
        }
      })
    } else setUserError('Passwords must match.')
  }

  return (
    <div className={css.outerForm}>
      <h1>{formTitle}</h1>
      <form className={css.innerForm} onSubmit={validAccount}>
        { action === 'createAccount' && <input type='email' id="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} /> }
        <input type='text' id="username" required value={username} placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
        <input className={css.password} type='password' id="password" required value={password} placeholder='Password'  onChange={(e) => setPassword(e.target.value)} />
        { action === 'createAccount' && <input type='password' id="password" required value={confirmPW} placeholder='Confirm Password'  onChange={(e) => setConfirmPW(e.target.value)} /> }
        { userError && <p className={css.userLSerror}><IoAlertCircleSharp/> {userError}</p>}
        <button id={css.submitBtn}>{submitButton}</button>
      </form>
      { action === 'verifyAccount' && <p className={css.loginSignupLink}>Dont have an account? <Link to='/signup'>Sign Up</Link></p> }
      { action === 'createAccount' && <p className={css.loginSignupLink}>Have an account? <Link to='/login'>Log In</Link></p> }
    </div>
  )
}

export default UserForm;
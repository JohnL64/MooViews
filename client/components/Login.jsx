import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
  const [invalidInfo, setInvalidInfo] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const history = useHistory();

  // useEffect(() => {
  //   document.cookie = 'hello=world';
  //   document.cookie = 'hellos=worlds';
  //   document.cookie = 'helloss=worldss';
    
  //   const allCookies = document.cookie;
  //   console.log(allCookies);
  // }, [])

  const verifyAccount = (e) => {
    e.preventDefault();
    fetch('/user/verifyAccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { username, password })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.verified === false) throw new Error(data);
      history.push('/home');
    })
    .catch(err => {
      console.log(err);
      setInvalidInfo(true);
      setUsername('');
      setPassword('');
    })
  }

  return (
    <div className="login">
      <form onSubmit={verifyAccount}>
        <label htmlFor="username">Username: </label>
        <input type='text' id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Password: </label>
        <input type='text' id="password" required value={password}  onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      <Link to='/signup'>Not a user sign up</Link>
      { invalidInfo && <p>Username or password is invalid. Please make sure the correct information is given</p>}
    </div>
  )
}

export default Login;
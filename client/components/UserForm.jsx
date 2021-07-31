import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const UserForm = ({ action }) => {
  const [invalidAccount, setInvalidAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const history = useHistory();

  const validAccount = (e) => {
    e.preventDefault();
    fetch(`/user/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { username, password })
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(data => {
      console.log(data);
      if (data.validAccount === false || !data.validAccount) throw new Error(data);
      history.push('/home');
    })
    .catch(err => {
      console.log(err);
      setInvalidAccount(true);
      setUsername('');
      setPassword('');
    })
  }

  return (
    <div className="userForm">
      <form onSubmit={validAccount}>
        <label htmlFor="username">Username: </label>
        <input type='text' id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Password: </label>
        <input type='text' id="password" required value={password}  onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      { (invalidAccount && action === 'verifyAccount') && <p>Username or password is invalid. Please make sure the correct information is given</p>}
      {(invalidAccount && action === 'createAccount') && <p>Invalid username or is already in use</p>}
    </div>
  )
}

export default UserForm;
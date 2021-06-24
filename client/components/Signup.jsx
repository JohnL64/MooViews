import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Signup = () => {

  const [createdAccount, setCreatedAccount] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const history = useHistory();

  const addUser = (e) => {
    e.preventDefault();
    fetch('/user/createAccount', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password})
    })
    .then(res => res.json())
    .then((data) => {
      if (typeof data === 'string') {
        throw Error(data);
      } else {
        history.push('/home');
      }
    })
    .catch((err) => {
      console.log(err);
      setCreatedAccount(false);
      setUsername('');
      setPassword('');
    })
  }

  return (
    <div className="signup">
      <form onSubmit={addUser}>
        <label htmlFor="username">Username: </label>
        <input type='text' id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Password: </label>
        <input type='text' id="password" required value={password}  onChange={(e) => setPassword(e.target.value)} />
        <button>Create Account</button>
      </form>
      {!createdAccount && <p>Invalid username or is already in use</p>}
    </div>
  );
}
 
export default Signup;
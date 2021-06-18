import React, { useState } from 'react';

const Login = () => {
  // const [username, setUsername] = useState('');
  let username = '';
  let password = '';

  const verifyUser = (e) => {
    e.preventDefault();
    console.log(username, password);
  }

  return (
    <div className="login">
      <form onSubmit={verifyUser}>
        <label htmlFor="username">Username: </label>
        <input type='text' id="username" required  onChange={(e) => username = e.target.value} />
        <label htmlFor="password">Password: </label>
        <input type='text' id="password" required  onChange={(e) => password = e.target.value} />
        <button>Login</button>
      </form>
    </div>
  )
}

export default Login;
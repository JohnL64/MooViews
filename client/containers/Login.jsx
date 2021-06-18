import React, { useState } from 'react';

const Login = () => {
  // const [username, setUsername] = useState('');
  let username = '';
  const verifyUser = (e) => {
    e.preventDefault();
    console.log(username);
  }

  return (
    <div className="login">
      <form onSubmit={verifyUser}>
        <label htmlFor="username">Username: </label>
        <input type='text' id="username" required  onChange={(e) => username = e.target.value} />
        <button>Login</button>
      </form>
    </div>
  )
}

export default Login;
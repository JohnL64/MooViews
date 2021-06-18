import React from 'react';

const Signup = () => {
  let username = '';
  let password = '';

  const addUser = (e) => {
    e.preventDefault();
    console.log(username, password);
  }

  return (
    <div className="signup">
      <form onSubmit={addUser}>
        <label htmlFor="username">Username: </label>
        <input type='text' id="username" required  onChange={(e) => username = e.target.value} />
        <label htmlFor="password">Password: </label>
        <input type='text' id="password" required  onChange={(e) => password = e.target.value} />
        <button>Sign Up</button>
      </form>
    </div>
  );
}
 
export default Signup;
import { useState } from "react";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  async function register() {

    const response = await fetch(
      "http://localhost:5000/api/signup",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    setMessage(data.message);
  }


  async function login() {

    const response = await fetch(
      "http://localhost:5000/api/signin",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    setMessage(data.message);
  }

  async function getProfile() {

    const response = await fetch(
      "http://localhost:5000/api/profile",
      {
        credentials: "include"
      }
    );

    const data = await response.json();

    setMessage(JSON.stringify(data));
  }

  async function logout() {

    const response = await fetch(
      "http://localhost:5000/api/logout",
      {
        method: "POST",

        credentials: "include"
      }
    );

    const data = await response.json();

    setMessage(data.message);
  }


  return (
    <div>

      <h1>JWT Cookie Authentication</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br />

      <button onClick={register}>
        Register
      </button>

      <button onClick={login}>
        Login
      </button>

      <button onClick={getProfile}>
        Get Profile
      </button>

      <button onClick={logout}>
        Logout
      </button>

      <p>{message}</p>

    </div>
  );
}

export default App;
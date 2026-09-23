import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function register() {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    setMessage(data.message);
  }

  async function login() {
    const response = await fetch("http://localhost:5000/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    setMessage(data.message);
  }

  async function getProfile() {
    let response = await fetch("http://localhost:5000/api/profile", {
      credentials: "include"
    });

    let data = await response.json();

    // Auto-refresh if access token expired
    if (data.code === "TOKEN_EXPIRED") {
      setMessage("Access token expired! Auto-refreshing...");
      const refreshResponse = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        credentials: "include"
      });

      if (refreshResponse.ok) {
        // Retry profile fetch with new access token
        response = await fetch("http://localhost:5000/api/profile", {
          credentials: "include"
        });
        data = await response.json();
      }
    }

    setMessage(JSON.stringify(data));
  }

  async function refreshToken() {
    const response = await fetch("http://localhost:5000/api/refresh", {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();
    setMessage(data.message);
  }

  async function logout() {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include"
    });

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

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={getProfile}>Get Profile</button>
      <button onClick={refreshToken}>Refresh Token</button>
      <button onClick={logout}>Logout</button>

      <p>{message}</p>
    </div>
  );
}

export default App;
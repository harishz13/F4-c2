import { useState, useEffect } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token, id } = await response.json();
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        onLogin();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      {error && <div>{error}</div>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      fetch(`https://dummyjson.com/users/${id}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? (
        <>
          <div>Username: {user.username}</div>
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>
            Address:
            <ul>
              {Object.entries(user.address).map(([value]) => (
                <li >
                   {value}
                </li>
              ))}
            </ul>
          </div>
          <div>Phone: {user.phone}</div>
          <div>Website: {user.website}</div>
          <div>Company: {user.company}</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <ProfilePage />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

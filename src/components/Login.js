import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      console.log(user.displayName);
      navigate("/dashboard");
    }
    if (error) alert(error);
  }, [error, loading, navigate, user]);

  const handleLogout = async () => {
    await logout();
    // Optionally, you can reset the todos state here if needed
  };

  return (
    <div className="login">
      <div className="login__container updated-container">
        <input
          type="email"
          className="login__textBox updated-textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
        />
        <input
          type="password"
          className="login__textBox updated-textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <button
          className="login__btn updated-btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Sign In
        </button>
        <button className="login__btn login__google updated-google-btn" onClick={signInWithGoogle}>
          Sign In with Google
        </button>
        <div>
          Sign up to <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

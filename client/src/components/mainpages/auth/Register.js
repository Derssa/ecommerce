import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/register", {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      setUser({
        user: "",
        email: "",
        password: "",
      });
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="login_page">
      <form onSubmit={registerSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          value={user.name}
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={user.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={user.password}
          autoComplete="on"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <div className="row">
          <button type="submit">Register</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

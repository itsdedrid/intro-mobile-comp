import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";

function submit(username, password, setCookie, navigate) {
  axios
    .post("http://localhost:5555/tokens/login", {
      NationalId: username,
      Password: password,
    })
    .then((response) => {
      setCookie("token", response.data.token);
      toast.success("Login successful");
      navigate("/main");
    })
    .catch((error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    });
}

function PasswordInput({ label, password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={label}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "5px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  let navigate = useNavigate();

  return (
    <center>
      <h1>To Do App</h1>
      <input
        type="text"
        placeholder="เลขประจำตัวประชาชน"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <br />
      <PasswordInput label="รหัสผ่าน" password={password} setPassword={setPassword} />

      <br />
      <button onClick={() => submit(username, password, setCookie, navigate)}>Login</button>
      <br />
      <a
        onClick={() => navigate("/register")}
        style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      >
        Register
      </a>
    </center>
  );
}

export default Login;

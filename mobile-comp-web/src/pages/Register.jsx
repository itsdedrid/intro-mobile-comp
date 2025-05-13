import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";
import { use } from "react";

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

function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    console.log(password, confirmPassword);
  }, [password, confirmPassword]); 

  const handleRegister = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    axios
      .post("http://localhost:5555/users/register", {
        NationalId: username,
        Password: password,
        Title: title,
        FirstName: firstName,
        LastName: lastName,
      })
      .then((response) => {
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          console.error(error)
        } else {
          toast.error("An error occurred");
        }
      });
  };

  

  return (
    <center>
      <h1>ลงทะเบียน</h1>
      <input
        type="text"
        placeholder="เลขประจำตัวประชาชน"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <br />
      <PasswordInput label="รหัสผ่าน" password={password} setPassword={setPassword} />
      <br />
      <PasswordInput label="ยืนยันรหัสผ่าน" password={confirmPassword} setPassword={setConfirmPassword} />
      <br />
      <input
        type="text"
        placeholder="คำนำหน้า"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <br />
      <input
        type="text"
        placeholder="ชื่อ"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      ></input>
      <br />
      <input
        type="text"
        placeholder="นามสกุล"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      ></input>
      <br />
      <button onClick={() => handleRegister(username, password, navigate)}>Register</button>
      <br />
      <a onClick={() => navigate("/login")} style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>
        Login
      </a>
    </center>
  );
}

export default Register;

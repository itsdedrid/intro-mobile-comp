import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// Password input with show/hide icon
function PasswordInput({ label, password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", marginBottom: "15px", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={label}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 10px 10px 10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {showPassword ? (
          // ปิดตา (Eye Off)
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="gray">
            <path d="M12 6.5c3.04 0 5.5 2.46 5.5 5.5 0 .62-.11 1.21-.31 1.76l3.15 3.15C22.03 15.29 23 13.73 23 12c-1.73-4.39-6-7.5-11-7.5-1.23 0-2.41.2-3.51.56L11.24 7c.25-.03.5-.05.76-.05zM2.81 2.81L1.39 4.22l3.5 3.5C3.24 9.14 1.97 10.47 1 12c1.73 4.39 6 7.5 11 7.5 2.02 0 3.93-.54 5.57-1.5l3.61 3.61 1.41-1.41L2.81 2.81zM5.99 8.4l1.53 1.53c-.01.02-.02.05-.02.07 0 1.93 1.57 3.5 3.5 3.5.02 0 .05-.01.07-.02l1.53 1.53C12.4 15.15 11.21 15.5 10 15.5c-2.49 0-4.5-2.01-4.5-4.5 0-1.21.35-2.4.99-3.39z" />
          </svg>
        ) : (
          // เปิดตา (Eye)
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="gray">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5 17.5 8.96 17.5 12 15.04 17.5 12 17.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(password, confirmPassword);
  }, [password, confirmPassword]);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    axios
      .post("http://10.203.233.120:5555/users/register", {
        NationalId: username,
        Password: password,
        Title: title,
        FirstName: firstName,
        LastName: lastName,
      })
      .then(() => {
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          console.error(error);
        } else {
          toast.error("An error occurred");
        }
      });
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>ลงทะเบียน</h2>
      <input
        type="text"
        placeholder="เลขประจำตัวประชาชน"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />
      <PasswordInput label="รหัสผ่าน" password={password} setPassword={setPassword} />
      <PasswordInput label="ยืนยันรหัสผ่าน" password={confirmPassword} setPassword={setConfirmPassword} />
      <input
        type="text"
        placeholder="คำนำหน้า"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="ชื่อ"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="นามสกุล"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={inputStyle}
      />
      <button
        onClick={handleRegister}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "10px"
        }}
      >
        สมัครสมาชิก
      </button>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <span>มีบัญชีอยู่แล้ว? </span>
        <span
          onClick={() => navigate("/login")}
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
        >
          เข้าสู่ระบบ
        </span>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

export default Register;

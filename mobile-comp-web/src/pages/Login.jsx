import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";

function submit(username, password, setCookie, navigate) {
  axios
    .post("http://10.203.233.120:5555/tokens/login", {
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
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={label}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          paddingRight: "10px",
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
          padding: 0,
        }}
      >
        {showPassword ? (
          // Eye-slash icon (hide password)
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="gray">
            <path d="M12 6.5c3.04 0 5.5 2.46 5.5 5.5 0 .62-.11 1.21-.31 1.76l3.15 3.15C22.03 15.29 23 13.73 23 12c-1.73-4.39-6-7.5-11-7.5-1.23 0-2.41.2-3.51.56L11.24 7c.25-.03.5-.05.76-.05zM2.81 2.81L1.39 4.22l3.5 3.5C3.24 9.14 1.97 10.47 1 12c1.73 4.39 6 7.5 11 7.5 2.02 0 3.93-.54 5.57-1.5l3.61 3.61 1.41-1.41L2.81 2.81zM5.99 8.4l1.53 1.53c-.01.02-.02.05-.02.07 0 1.93 1.57 3.5 3.5 3.5.02 0 .05-.01.07-.02l1.53 1.53C12.4 15.15 11.21 15.5 10 15.5c-2.49 0-4.5-2.01-4.5-4.5 0-1.21.35-2.4.99-3.39z"/>
          </svg>

        ) : (
          // Eye icon (show password)
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="gray">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5 17.5 8.96 17.5 12 15.04 17.5 12 17.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z"/>
          </svg>

        )}
      </button>
    </div>
  );
}


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>To do web</h1>

        <input
          type="text"
          placeholder="เลขประจำตัวประชาชน"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <div style={{ marginTop: "15px" }}>
          <PasswordInput label="รหัสผ่าน" password={password} setPassword={setPassword} />
        </div>

        <button onClick={() => submit(username, password, setCookie, navigate)} style={styles.button}>
          Login
        </button>

        <p style={styles.registerText}>
          ยังไม่มีบัญชี?{" "}
          <span onClick={() => navigate("/register")} style={styles.registerLink}>
            สมัครสมาชิก
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  registerText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  registerLink: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;

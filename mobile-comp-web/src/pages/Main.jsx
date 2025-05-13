import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "dayjs/locale/th";
import  {Sidebar}  from "../components/Sidebar";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
dayjs.locale("th");

export default function MainPage() {
  const [cookies] = useCookies(["token"]);
  const [userId, setUserId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({ name: "", whatTime: "" });
  const [editActivity, setEditActivity] = useState(null);

  const navigate = useNavigate();

  // ตรวจสอบ token หมดอายุ
  useEffect(() => {
    const checkToken = () => {
      if (!cookies.token) return;
      try {
        const decoded = jwtDecode(cookies.token);
        if (decoded.exp < Date.now() / 1000) {
          toast.error("Session หมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
          navigate("/login");
        }
      } catch (err) {
        toast.error("Token ไม่ถูกต้อง");
        navigate("/login");
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 10000);
    return () => clearInterval(interval);
  }, [cookies.token, navigate]);

  // โหลดข้อมูลผู้ใช้และกิจกรรม
  useEffect(() => {
    if (!cookies.token) return;

    axios
      .get("http://10.203.233.120:5555/users/", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        setUserId(res.data.id);
        return axios.get("http://10.203.233.120:5555/activities", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
      })
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("โหลดข้อมูลไม่สำเร็จ");
        navigate("/login");
      });
  }, [cookies.token, navigate, loading,newActivity]);

  // เพิ่มกิจกรรม
  const handleAdd = () => {
    if (!newActivity.name || !newActivity.whatTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const activity = { ...newActivity, UserId: userId };

    axios
      .post("http://10.203.233.120:5555/activities", activity, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        setActivities([...activities, res.data]);
        setNewActivity({ name: "", whatTime: "" });
        toast.success("เพิ่มกิจกรรมสำเร็จ");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
      });
  };

  // ลบกิจกรรม
  const handleDelete = (id) => {
    axios
      .delete(`http://10.203.233.120:5555/activities/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then(() => {
        setActivities(activities.filter((a) => a.id !== id));
        toast.success("ลบกิจกรรมแล้ว");
      })
      .catch(() => toast.error("ไม่สามารถลบกิจกรรมได้"));
  };

  const handleEdit = (activity) => {
    setEditActivity(activity);
    setNewActivity({
      name: activity.name,
      whatTime: activity.whatTime.slice(0, 16),
    });
  };
  

  const handleSaveEdit = () => {
    if (!newActivity.name || !newActivity.whatTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
  
    axios
      .put(
        `http://10.203.233.120:5555/activities/${editActivity.id}`,
        {
          name: newActivity.name,
          whatTime: newActivity.whatTime,
          UserId: userId,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      )
      .then((res) => {
        setActivities(
          activities.map((a) => (a.id === editActivity.id ? res.data : a))
        );
        setNewActivity({ name: "", whatTime: "" });
        setEditActivity(null);
        toast.success("แก้ไขกิจกรรมสำเร็จ");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
      });
  };
  
  

  return (
    <>
    <Sidebar/>
    <div style={styles.container}>
      <h1 style={styles.title}>ระบบกิจกรรม</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="ชื่อกิจกรรม"
          value={newActivity.name}
          onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
        />
        <input
          style={styles.input}
          type="datetime-local"
          value={newActivity.whatTime}
          onChange={(e) => setNewActivity({ ...newActivity, whatTime: e.target.value })}
        />
        <button style={styles.button} onClick={handleAdd}>
          เพิ่ม
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ชื่อกิจกรรม</th>
            <th style={styles.th}>วันเวลา</th>
            <th style={styles.th}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td style={styles.td}>{activity.name}</td>
              <td style={styles.td}>
                {dayjs(activity.whatTime).format("D MMMM BBBB เวลา HH:mm น.")}
              </td>
              <td style={styles.td}>
              <button style={styles.editButton} onClick={() => handleEdit(activity)}>
                  แก้ไข
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(activity.id)}>
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {editActivity && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2>แก้ไขกิจกรรม</h2>
      <input
        style={styles.input}
        placeholder="ชื่อกิจกรรม"
        value={newActivity.name}
        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
      />
      <input
        style={styles.input}
        type="datetime-local"
        value={newActivity.whatTime}
        onChange={(e) => setNewActivity({ ...newActivity, whatTime: e.target.value })}
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button style={styles.button} onClick={handleSaveEdit}>
          บันทึก
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "red" }}
          onClick={() => {
            setEditActivity(null);
            setNewActivity({ name: "", whatTime: "" });
          }}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

// ✅ CSS in JS
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    fontSize: "16px",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",       // ✅ เลื่อน modal ไปด้านบน
    paddingTop: "80px",             // ✅ ระยะห่างจากด้านบน
    zIndex: 1000,
  },
  
  modalContent: {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",         // ✅ ใช้พื้นที่กว้างขึ้นในหน้าจอ
  maxWidth: "750px",    // ✅ หรือมากกว่านี้ถ้าต้องการ
  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
},

  editButton: {
    padding: "6px 12px",
    backgroundColor: "#2196F3", // สีฟ้า
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px", // ให้เว้นระยะห่างจากปุ่มลบ
  },
  
};

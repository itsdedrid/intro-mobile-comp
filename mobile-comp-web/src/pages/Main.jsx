import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import MaterialTable from "@material-table/core";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import DatePickerThai from "../components/DatePickerThai";
import dayjs from "../dayjsConfig";
import { jwtDecode } from "jwt-decode";

function Main(props) {
  
  const [cookies] = useCookies(["token"]);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Get current user ID from JWT token or from user info endpoint
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (!cookies.token) return;

      try {
        const decoded = jwtDecode(cookies.token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          toast.error("Session หมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
          navigate("/login");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    };

    // เช็กทันทีตอน mount
    checkTokenExpiry();

    // เช็กทุก 10 วินาที
    const interval = setInterval(checkTokenExpiry, 10000);

    return () => clearInterval(interval);
  }, [cookies.token, navigate]);

  useEffect(() => {
    // First, get the current user info to have access to userId
    axios
      .get("http://localhost:5555/users/", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((userResponse) => {
        setUserId(userResponse.data.id);

        // Then fetch activities
        axios
          .get("http://localhost:5555/activities", {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          })
          .then((response) => {
            setActivities(response.data);
            setLoading(false);
          })
          .catch((error) => {
            if (error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error("An error occurred while fetching activities");
            }
          });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Unable to get user information");
        }
        // If can't get user info, redirect to login
        navigate("/login");
      });
  }, [cookies.token, navigate, loading]);

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px" }}>
        <h1>Main Page</h1>
        <MaterialTable
          title="Activities"
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Date",
              field: "whatTime",
              type: "datetime-local",
              render: (rowData) => dayjs(rowData.whatTime).format("D MMMM BBBB เวลา HH:mm น."),
              editComponent: (props) => <DatePickerThai value={props.value} onChange={props.onChange} />,
            },
          ]}
          data={activities} // This should be an array, not a function
          editable={{
            onRowAdd: async (newData) => {
              // Include the UserId in the new activity to satisfy the foreign key constraint
              const activityData = {
                ...newData,
                UserId: userId, // This is critical to fix the foreign key error
              };

              return axios
                .post("http://localhost:5555/activities", activityData, {
                  headers: {
                    Authorization: "Bearer " + cookies.token,
                  },
                })
                .then((response) => {
                  // Update with the actual returned data from the server
                  setActivities([...activities, response.data]);
                  setLoading(true);
                  toast.success("Activity added successfully");
                })
                .catch((error) => {
                  if (error.response) {
                    toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
                  } else {
                    toast.error("An error occurred while adding the activity");
                  }
                  // Rethrow to prevent MaterialTable from updating local state
                  throw error;
                });
            },
            onRowUpdate: async (newData, oldData) => {
              return axios
                .put(
                  `http://localhost:5555/activities/${oldData.id}`,
                  { name: newData.name, whatTime: newData.whatTime, UserId: userId },
                  {
                    headers: {
                      Authorization: "Bearer " + cookies.token,
                    },
                  }
                )
                .then((response) => {
                  const updatedActivities = activities.map((activity) =>
                    activity.id === oldData.id ? { ...response.data } : activity
                  );
                  setActivities(updatedActivities);
                  toast.success("Activity updated successfully");
                })
                .catch((error) => {
                  if (error.response) {
                    toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
                  } else {
                    toast.error("An error occurred while updating the activity");
                  }
                  throw error;
                });
            },
            onRowDelete: async (oldData) => {
              return axios
                .delete(`http://localhost:5555/activities/${oldData.id}`, {
                  headers: {
                    Authorization: "Bearer " + cookies.token,
                  },
                })
                .then((response) => {
                  const filteredActivities = activities.filter((activity) => activity.id !== oldData.id);
                  setActivities(filteredActivities);
                  toast.success("Activity deleted successfully");
                })
                .catch((error) => {
                  if (error.response) {
                    toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
                  } else {
                    toast.error("An error occurred while deleting the activity");
                  }
                  throw error;
                });
            },
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
          }}
        />
      </div>
    </div>
  );
}

export default Main;

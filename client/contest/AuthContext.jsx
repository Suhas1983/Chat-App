import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ================= CHECK AUTH =================

  const checkAuth = async () => {
    try {
      if (!token) return;

      axios.defaults.headers.common["token"] = token;

      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOGIN / SIGNUP =================

  const login = async (state, credentials) => {
    try {

      const { data } = await axios.post(
        `/api/auth/${state}`,
        credentials
      );

      if (data.success) {

        const user = data.user || data.userData;

        setAuthUser(user);

        setToken(data.token);

        localStorage.setItem("token", data.token);

        axios.defaults.headers.common["token"] = data.token;

        connectSocket(user);

        toast.success(data.message);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.removeItem("token");

    delete axios.defaults.headers.common["token"];

    setToken(null);

    setAuthUser(null);

    setOnlineUsers([]);

    if (socket) {
      socket.disconnect();
    }

    toast.success("Logged Out Successfully");
  };

  // ================= UPDATE PROFILE =================

  const updateProfile = async (body) => {

    try {

      const { data } = await axios.put(
        "/api/auth/update-profile",
        body
      );

      if (data.success) {

        setAuthUser(data.user);

        toast.success("Profile Updated Successfully");

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(error.response?.data?.message || error.message);

    }
  };

  // ================= SOCKET =================

  const connectSocket = (userData) => {

    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // ================= USE EFFECT =================

  useEffect(() => {

    if (token) {

      axios.defaults.headers.common["token"] = token;

      checkAuth();

    }

  }, [token]);

  // ================= CONTEXT VALUE =================

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Get messages with selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Send message
const sendMessage = async (messageData) => {
  try {
    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData
    );

    if (data.success) {
      setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  }
};
  // Listen for new messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", async (newMessage) => {
      try {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
          newMessage.seen = true;

          setMessages((prevMessages) => [
            ...prevMessages,
            newMessage,
          ]);

          await axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
          setUnseenMessages((prev) => ({
            ...prev,
            [newMessage.senderId]:
              (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    });
  };

  // Remove socket listener
  const unsubscribeFromMessages = () => {
    if (!socket) return;
    socket.off("newMessage");
  };

  useEffect(() => {
    if (!socket) return;

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
    selectedUser,
    setSelectedUser,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
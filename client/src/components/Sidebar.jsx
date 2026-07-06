import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../contest/AuthContext";
import { ChatContext } from "../../contest/ChatContext";
import { useEffect } from "react";

const Sidebar = () => {

  const {getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages}=useContext(ChatContext)
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const [input,setInput]=useState(false)

  const { logout ,onlineUsers} = useContext(AuthContext);
  const filteredUsers=input ?  users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())):users;
  useEffect(()=>{
    getUsers();
  },[onlineUsers])
  return (
    <div
      className={`bg-[#1F1B2E] h-full p-5 rounded-r-xl overflow-y-auto text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Logo */}
      <div className="flex justify-between items-center relative">
        <img src={assets.logo} alt="Logo" className="max-w-32" />

        <img
          src={assets.menu_icon}
          alt="menu"
          className="max-h-5 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        />

        {showMenu && (
          <div className="absolute top-8 right-0 w-40 bg-[#2A2342] rounded-lg shadow-lg border border-gray-700 z-50 overflow-hidden">
            <button
              onClick={() => {
                navigate("/profile");
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#3B325C]"
            >
              Edit Profile
            </button>

            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#3B325C] text-red-400"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
<div className="bg-[#282142] rounded-full flex items-center gap-3 py-3 px-4 mt-5">
  <img
    src={assets.search_icon}
    alt="Search"
    className="w-4 h-4"
  />

  <input
    onChange={(e) => setInput(e.target.value)}
    type="text"
    placeholder="Search User..."
    className="bg-transparent outline-none border-none text-white text-sm placeholder-[#c8c8c8] flex-1"
  />
</div>
      {/* User List */}
      <div className="flex flex-col mt-5">
        {filteredUsers.map((user, index) => (
          <div
            key={user._id}
            onClick={() => {setSelectedUser(user);setUnseenMessages(prev=>({...prev,[user._id]:0}))}}
            className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              selectedUser?._id === user._id
                ? "bg-[#282142]/60"
                : "hover:bg-[#282142]/30"
            }`}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col flex-1">
              <p className="font-medium">{user.fullName}</p>

              {onlineUsers.includes(user._id)
               ? (
                <span className="text-xs text-green-400">
                  Online
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  Offline
                </span>
              )}
            </div>

            {unseenMessages[user._id] > 0 && (
              <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-violet-500 flex justify-center items-center text-xs">
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
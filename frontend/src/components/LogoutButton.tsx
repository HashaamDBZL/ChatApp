import React from "react";
import { useNavigate } from "react-router";
import socket from "../socket";

const LogoutButton = () => {
  const navigate = useNavigate();
  function handleLogout(event): void {
    socket.emit("user_logout", localStorage.getItem("userId"));
    console.log("Emmitted logout event");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div
      onClick={handleLogout}
      className="border-solid border-black border-2 rounded-lg px-2 py-1"
    >
      <div className="flex w-full h-full cursor-pointer text-xs font-normal">
        Logout
      </div>
    </div>
  );
};

export default LogoutButton;

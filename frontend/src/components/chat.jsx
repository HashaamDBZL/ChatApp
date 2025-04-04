import { useAuth } from "../contexts/AuthContexts"; // Adjust the path

function Chat() {
  const { logout } = useAuth();

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div>
      <h1>Welcome to the Chat!</h1>
      <button onClick={handleLogoutClick}>Logout</button>
      {/* Your main chat UI components here */}
    </div>
  );
}

export default Chat;

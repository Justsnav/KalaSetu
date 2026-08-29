import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#1c1713] text-[#f5efe8] p-8">
      <h1 className="text-3xl font-serif">Welcome, {user?.name}</h1>
      <p className="text-[#8d8177]">Buyer Dashboard — coming soon.</p>
      <button onClick={handleLogout} className="mt-4 underline">
        Logout
      </button>
    </div>
  );
}

export default BuyerDashboard;
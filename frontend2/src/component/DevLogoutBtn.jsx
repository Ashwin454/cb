import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Reset } from '../slices/authSlice'; // ✅ adjust path
import { ResetProfile } from '../slices/Profile'; // ✅ if you have a reset
import { useEffect } from 'react';

export default function DevLogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    // Safely reset all user/auth/profile state
    dispatch(Reset());           // clears token + user
    dispatch(ResetProfile());    // if you have such action

    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-500 hover:underline"
    >
      🔓 Fake Logout
    </button>
  );
}
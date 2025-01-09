'use client';
import { useAuth } from '@/context/AuthContext';
import { SignOut } from '@/firebase/config';

export default function Dashboard() {
  const { user } = useAuth();

  const handleLogOut = async () => {
    try {
      await SignOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  );
}

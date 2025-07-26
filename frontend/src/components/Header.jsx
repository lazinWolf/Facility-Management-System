import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const now = new Date();
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <h1 className="text-xl font-semibold">Welcome, {user.name}</h1>
      <div className="text-gray-600 text-sm">
        {now.toLocaleDateString()} &nbsp; {now.toLocaleTimeString()}
      </div>
    </header>
  );
}

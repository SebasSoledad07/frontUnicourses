import { useNavigate } from "react-router-dom";

export default function ProfileHeader() {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/edit-profile"); // Cambia esta ruta si es diferente
  };

  return (
    <div className="bg-white rounded-xl p-6 flex justify-between items-center shadow">
      <div className="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/women/50.jpg"
          alt="User"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">Sarah Wilson</h2>
          <p className="text-sm text-gray-500">Computer Science Student</p>
          <p className="text-sm text-gray-500">📍 San Francisco, CA</p>
        </div>
      </div>
      <button
        onClick={handleEditClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>
    </div>
  );
}

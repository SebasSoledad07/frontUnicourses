import { useState } from "react";
import { useNavigate } from "react-router-dom";

const interestsList = [
  "Programming",
  "Data Science",
  "Artificial Intelligence",
  "Web Development",
  "Cybersecurity",
  "Mobile Development",
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    careerInterest: "Computer Science",
    interests: ["Programming", "Web Development"],
  });

  const toggleInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a tu backend
    console.log("Saving profile...", profile);
    navigate("/student-profile");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/profile-pic.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">Profile Photo</p>
            <p className="text-sm text-gray-500">
              Upload a new photo or remove the current one
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
            placeholder="Last Name"
          />
        </div>

        <div className="mb-4">
          <select
            name="careerInterest"
            value={profile.careerInterest}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Data Science">Data Science</option>
            <option value="AI & ML">AI & ML</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Web Development">Web Development</option>
          </select>
        </div>

        <div className="mb-6">
          <p className="font-medium mb-2">Your Interests</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestsList.map((interest) => (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-2 rounded-md border ${
                  profile.interests.includes(interest)
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="border px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

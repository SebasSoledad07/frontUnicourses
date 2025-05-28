import { useEffect, useState } from "react";

const interestsList: string[] = [
  "Mathematics",
  "Science",
  "Programming",
  "Art",
  "Music",
  "Sports",
  "History",
  "Literature",
  "Languages",
];

export default function PerfilUsuario() {
  const [profile, setProfile] = useState({
    fullname: "",
    intereses: [] as string[],
    career_interest: "", // nuevo campo
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/perfil/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Asumimos que el backend retorna "first_name" y no "fullname"
        setProfile({
          fullname: data.fullname || data.first_name || "",
          intereses: data.intereses || [],
          career_interest: data.career_interest || "",
        });
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev) => {
      const intereses = prev.intereses.includes(interest)
        ? prev.intereses.filter((i) => i !== interest)
        : [...prev.intereses, interest];
      return { ...prev, intereses };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:8000/api/perfil/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullname: profile.fullname,
        intereses: profile.intereses,
        career_interest: profile.career_interest,
      }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message || "Perfil actualizado correctamente"))
      .catch(() => alert("Error al actualizar el perfil"));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <input
          type="text"
          name="fullname"
          value={profile.fullname}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md w-full mb-4"
          placeholder="Full Name"
        />

        <select
          name="career_interest"
          value={profile.career_interest}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md mb-6"
        >
          <option value="">Select a Career Interest</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Data Science">Data Science</option>
          <option value="AI & ML">AI & ML</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Web Development">Web Development</option>
        </select>

        <div className="mb-6">
          <p className="font-medium mb-2">Your Interests</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestsList.map((interest) => (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-2 rounded-md border ${
                  profile.intereses.includes(interest)
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
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

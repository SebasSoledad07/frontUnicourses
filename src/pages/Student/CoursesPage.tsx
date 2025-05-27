import { useState } from "react";
import { Bookmark, Clock, GraduationCap } from "lucide-react";
import StudentNavbar from "../../components/StudentProfile/ProfileHeader";

const mockCourses = [
  {
    id: 1,
    title: "Introduction to Python Programming",
    platform: "Coursera",
    duration: "40 hours",
    level: "Beginner",
    tags: ["Programming", "Python"],
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    platform: "YouTube",
    duration: "25 hours",
    level: "Intermediate",
    tags: ["Web Dev", "JavaScript"],
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    platform: "EdTeam",
    duration: "30 hours",
    level: "Beginner",
    tags: ["Design", "UI/UX"],
  },
];

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  return (
    <>
      <StudentNavbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <input
            type="text"
            placeholder="Search for courses..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-4">
            <select className="border border-gray-300 px-4 py-2 rounded-md">
              <option>All Platforms</option>
              <option>Coursera</option>
              <option>YouTube</option>
              <option>EdTeam</option>
            </select>
            <select className="border border-gray-300 px-4 py-2 rounded-md">
              <option>All Topics</option>
              <option>Programming</option>
              <option>Web Dev</option>
              <option>Design</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {mockCourses
            .filter((course) =>
              course.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-lg relative"
              >
                <p className="text-sm text-gray-500 mb-2">{course.platform}</p>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  {course.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500 gap-4 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" /> {course.level}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => toggleSave(course.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      saved.includes(course.id) ? "fill-blue-600" : "fill-none"
                    }`}
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

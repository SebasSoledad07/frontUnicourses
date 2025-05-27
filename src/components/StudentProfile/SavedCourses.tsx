const saved = [
  { name: "Machine Learning Basics", date: "Apr 15, 2025", icon: "🧠" },
  { name: "Mobile App Development", date: "May 1, 2025", icon: "📱" },
];

export default function SavedCourses() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Saved Courses</h3>
      {saved.map((course, i) => (
        <div key={i} className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span>{course.icon}</span>
            <div>
              <p className="font-medium">{course.name}</p>
              <p className="text-sm text-gray-500">Starts on {course.date}</p>
            </div>
          </div>
          <span className="text-gray-400">🔖</span>
        </div>
      ))}
    </div>
  );
}

const courses = [
  { name: "Advanced Web Development", date: "Jan 15, 2025" },
  { name: "Database Management", date: "Mar 2, 2025" },
];

export default function CompletedCourses() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Completed Courses</h3>
      {courses.map((course, i) => (
        <div key={i} className="flex justify-between items-center mb-3">
          <div>
            <p className="font-medium">{course.name}</p>
            <p className="text-sm text-gray-500">Completed on {course.date}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Completed</span>
        </div>
      ))}
    </div>
  );
}

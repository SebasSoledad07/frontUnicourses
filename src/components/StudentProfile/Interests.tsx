const interests = ["Web Development", "AI & ML", "Mobile Development", "Database"];

export default function Interests() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Your Interests</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {interests.map((tag, i) => (
          <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">{tag}</span>
        ))}
      </div>
      <button className="text-blue-600 text-sm">+ Update Interests</button>
    </div>
  );
}

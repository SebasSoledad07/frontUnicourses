const recs = [
  {
    title: "Cloud Computing Fundamentals",
    reason: "Based on your interest in Web Development"
  },
  {
    title: "Data Science Essentials",
    reason: "Based on your interest in AI & ML"
  }
];

export default function Recommendations() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Recommended for You</h3>
      {recs.map((rec, i) => (
        <div key={i} className="mb-4">
          <p className="font-medium">{rec.title}</p>
          <p className="text-sm text-gray-500">{rec.reason}</p>
          <button className="text-blue-600 text-sm mt-1">+ Add to Saved</button>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";

// Componente Input
const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    {...props}
  />
);

// Componente Button
const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
    {...props}
  >
    {children}
  </button>
);

// Componente Badge
const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}) => {
  const base = "text-sm px-2 py-1 rounded-full";
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-400 text-gray-800",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

// Componente Card y CardContent
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white border rounded-lg shadow p-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

const courses = [
  {
    title: "Introduction to Python Programming",
    duration: "40 hours",
    platform: "Coursera",
    tags: ["Python", "Programming", "Computer Science"],
  },
  {
    title: "UI/UX Design Fundamentals",
    duration: "25 hours",
    platform: "YouTube",
    tags: ["Design", "UI/UX", "Creative"],
  },
  {
    title: "Data Science with R",
    duration: "35 hours",
    platform: "EdTeam",
    tags: ["Data Science", "R Programming", "Statistics"],
  },
];

export default function AdminCourseView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">UniCourses</h1>
        <div className="flex items-center space-x-2 w-full max-w-xl">
          <Input
            type="text"
            placeholder="Search courses by name, career or interests"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Search</Button>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        {["Programming", "Data Science", "Business", "Design"].map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCourses.map((course, idx) => (
          <Card key={idx} className="flex justify-between items-start">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
              <p className="text-sm text-gray-500">
                {course.duration} • {course.platform}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              ↗
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}

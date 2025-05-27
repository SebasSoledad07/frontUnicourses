import ProfileHeader from "../../components/StudentProfile/ProfileHeader";
import CompletedCourses from "../../components/StudentProfile/CompletedCourses";
import SavedCourses from "../../components/StudentProfile/SavedCourses";
import Interests from "../../components/StudentProfile/Interests";
import Recommendations from "../../components/StudentProfile/Recommendations";

export default function StudentProfile() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CompletedCourses />
            <SavedCourses />
          </div>
          <div className="space-y-6">
            <Interests />
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
}

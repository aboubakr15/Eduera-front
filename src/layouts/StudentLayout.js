import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/sidebars/StudentSidebar";
const StudentLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

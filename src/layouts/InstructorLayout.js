import { Outlet } from "react-router-dom";
import InstructorSidebar from "../components/sidebars/InstructorSidebar";
import Topbar from "../components/Topbar";

const InstructorLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#F8F9FB] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;

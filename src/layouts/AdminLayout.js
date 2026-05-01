import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/sidebars/AdminSidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {
  return (
    <div className={`flex h-screen overflow-hidden`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white rounded-bl-3xl">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;

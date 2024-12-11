import AdminSidebar from "@/components/admin/AdminSidebar";

const adminLayout = ({ children }) => {
  return (
    <div className="flex md:flex-row flex-col flex-wrap  min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 md:p-6 ">{children}</main>
    </div>
  );
};

export default adminLayout;

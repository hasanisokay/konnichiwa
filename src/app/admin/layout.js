import AdminSidebar from "@/components/admin/AdminSidebar";

const adminLayout = ({ children }) => {
  return (
    <div className="flex md:flex-row flex-col   md:min-h-[calc(100vh-68px)]">
      {/* Sidebar */}
      <AdminSidebar />
      <section className="flex-1 bg-gray-100 lg:p-4 ">{children}</section>
    </div>
  );
};

export default adminLayout;

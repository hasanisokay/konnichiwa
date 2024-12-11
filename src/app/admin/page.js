import AdminDashboard from "@/components/admin/AdminDashboard";
import NotFound from "@/components/not-found/NotFound";
import getDashboardData from "@/utils/getDashboardData.mjs";

const adminPage = async () => {
  let data;
  try {
    const d = await getDashboardData();
    console.log(d)
    if (d.status === 200) {
      data = d.data;
    }
  } catch (error) {
    console.log(error);
    data = null;
  }

  if (!data) return <NotFound />;
  return <AdminDashboard d={data} />;
};

export default adminPage;

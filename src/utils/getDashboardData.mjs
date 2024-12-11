import hostname from "@/constants/hostname.mjs";

const getDashboardData = async () => {
  const host = await hostname();
  const res = await fetch(
    `${host}/api/gets/admin-dashboard`
  );
  const data = await res.json();
  return data || [];
};

export default getDashboardData;

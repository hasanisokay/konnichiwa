import hostname from "@/constants/hostname.mjs";

const getUsers = async (page, limit, sort, keyword = "") => {
  const host = await hostname();
  const res = await fetch(
    `${host}/api/gets/users?page=${page || 1}&&limit=${
      limit || 100
    }&&sort=${sort}&&keyword=${keyword}`, {credentials:'include'}
  );
  const data = await res.json();
  return data?.data || [];
};

export default getUsers;

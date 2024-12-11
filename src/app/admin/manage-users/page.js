import ManageUsers from "@/components/admin/ManageUsers";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import getUsers from "@/utils/getUsers.mjs";

const manaeUsersPage = async ({searchParams}) => {
    const page = parseInt((await searchParams)?.page) || 1;
    const limit = parseInt((await searchParams)?.limit) || 10;
    const sort = (await searchParams)?.sort || "newest";
    const keyword = (await searchParams)?.keyword || "";

    let users;
    let totalCount;
    try {
        const d = await getUsers(page, limit, sort, keyword);

        users = d?.users;
        totalCount = d?.totalCount || 0;
        
      } catch (error) {
        console.log(error);
        users = null;
      }
      const totalPages = Math.ceil(totalCount / limit);
      if (!users) return <NotFound />;
      return (
        <>
          <ManageUsers u={users} />
          {totalCount > limit &&  <PaginationDefault p={page} totalPages={totalPages}/>}
        </>
      );
};

export default manaeUsersPage;
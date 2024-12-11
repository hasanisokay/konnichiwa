import AdminLessonsList from "@/components/admin/AdminLessonsList";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import getLessons from "@/utils/getLessons.mjs";

const userTutorialsPage = async({ searchParams }) => {
    const page = parseInt((await searchParams)?.page) || 1;
    const limit = parseInt((await searchParams)?.limit) || 10;
    const sort = (await searchParams)?.sort || "newest";
    const keyword = (await searchParams)?.keyword || "";
    let lessons;
    let totalCount;
    try {
        const d = await getLessons(page, limit, sort, keyword);
        lessons = d?.lessons;
        totalCount = d?.totalCount || 0;
        
      } catch (error) {
        console.log(error);
        lessons = null;
      }
      const totalPages = Math.ceil(totalCount / limit);

      if (!lessons) return <NotFound />;
      return (
        <>
          {/* <AdminLessonsList lessons={lessons} /> */}
          {totalCount > limit &&          <PaginationDefault p={page} totalPages={totalPages}/>}
        </>
      );
};

export default userTutorialsPage;
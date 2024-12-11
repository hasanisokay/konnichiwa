import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";
import UserLessonPage from "@/components/user/UserLessonPage";
import getLessons from "@/utils/getLessons.mjs";

const userLessonPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const keyword = (await searchParams)?.keyword || "";
  let lessons;
  let totalCount;
  try {
    const d = await getLessons(page, 1000000, sort, keyword);
    lessons = d?.lessons;
    totalCount = d?.totalCount || 0;
  } catch (error) {
    console.log(error);
    lessons = null;
  }


  if (!lessons) return <NotFound />;
  return (
    <>
      <UserLessonPage l={lessons} />
    </>
  );
};

export default userLessonPage;
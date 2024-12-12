import NotFound from "@/components/not-found/NotFound";
import UserLessonPage from "@/components/user/UserLessonPage";
import getProgress from "@/server-funcitons/getProgress.mjs";
import getLessons from "@/utils/getLessons.mjs";

const userLessonPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const keyword = (await searchParams)?.keyword || "";
  let lessons;
  let totalCount;
  let progress 
  try {
    const d = await getLessons(page, 1000000, sort, keyword);
    lessons = d?.lessons;
    totalCount = d?.totalCount || 0;
    progress = await getProgress();
  } catch (error) {
    console.log(error);
    lessons = null;
  }


  if (!lessons) return <NotFound />;
  return (
    <>
      <UserLessonPage p={progress} l={lessons} />
    </>
  );
};

export default userLessonPage;
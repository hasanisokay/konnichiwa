
import TutorialsList from "@/components/admin/TutorialsList";
import NotFound from "@/components/not-found/NotFound";
import PaginationDefault from "@/components/pagination/PaginationDefault";

import getTutorials from "@/utils/getTutorials.mjs";

const adminTutorialsPage = async ({ searchParams }) => {
  const page = parseInt((await searchParams)?.page) || 1;
  const limit = parseInt((await searchParams)?.limit) || 10;
  const sort = (await searchParams)?.sort || "newest";
  const keyword = (await searchParams)?.keyword || "";
  let tutorials;
  let totalCount;
  try {
    const d = await getTutorials(page, limit, sort, keyword);
    tutorials = d?.data?.tutorials;
    totalCount = d?.data?.totalCount || 0;
  } catch (error) {
    console.log(error);
    tutorials = null;
  }
  const totalPages = Math.ceil(totalCount / limit);

  if (!tutorials) return <NotFound />;
  return (
    <>
      <TutorialsList t={tutorials} />
      {totalCount > limit && (
        <PaginationDefault p={page} totalPages={totalPages} />
      )}
    </>
  );
};

export default adminTutorialsPage;

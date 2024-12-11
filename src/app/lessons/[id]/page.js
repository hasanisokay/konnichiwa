import NotFound from "@/components/not-found/NotFound";
import SingleLessonPage from "@/components/user/SingleLessonPage";
import getLessonsWithVocabs from "@/utils/getLessonsWithVocabs.mjs";

const singleLessonPage = async ({ params }) => {
  const lessonNumber = (await params)?.id;
  const l = await getLessonsWithVocabs(1, 10000000, "", "", lessonNumber);
  if (l?.data?.lessons?.length === 0 || !l?.data) {
    return <NotFound />;
  }
  return <SingleLessonPage l={l?.data?.lessons || []} />;
};

export default singleLessonPage;

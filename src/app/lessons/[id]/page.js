import NotFound from "@/components/not-found/NotFound";
import SingleLessonPage from "@/components/user/SingleLessonPage";
import getProgress from "@/server-funcitons/getProgress.mjs";
import getLessonsWithVocabs from "@/utils/getLessonsWithVocabs.mjs";

const singleLessonPage = async ({ params }) => {
  const lessonNumber = (await params)?.id;
  const l = await getLessonsWithVocabs(1, 10000000, "", "", lessonNumber);
  if (l?.data?.lessons?.length === 0 || !l?.data) {
    return <NotFound />;
  }


  return (
    <SingleLessonPage  l={l?.data?.lessons || []} />
  );
};

export default singleLessonPage;

export async function generateMetadata({ params }) {
  const lessonNumber = (await params)?.id ||"";
  return {
    title: `Konnichiwa | Lesson ${lessonNumber}`,
    description: `Dive into Lesson ${lessonNumber} to enhance your Japanese language skills with tailored content and exercises.`,
  };
}
import AddNewVocabulary from "@/components/admin/AddNewVocabulary";

const addLessonPage = () => {
    return (
        <div>
            <AddNewVocabulary />
        </div>
    );
};

export default addLessonPage;
export async function generateMetadata() {
    return {
        title: "Konnichiwa | Add Vocabulary",
        description: "Expand the vocabulary library with new words and phrases."
      }
  }
  
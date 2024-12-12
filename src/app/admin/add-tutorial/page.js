import AddNewTutorial from '@/components/admin/AddNewTutorial';

const addTutorialPage = () => {
    return (
        <div>
            <AddNewTutorial />
        </div>
    );
};

export default addTutorialPage;

export async function generateMetadata() {
    return {
        title: "Konnichiwa | Add Tutorial",
        description: "Upload and manage tutorials to enhance language learning."
      }
  }
  
import AddNewLesson from "@/components/admin/AddNewLessonForm";
import React from "react";

const addLessonPage = () => {
  return (
    <div>
      <AddNewLesson />
    </div>
  );
};

export default addLessonPage;

export async function generateMetadata() {
  return {
    title: "Konnichiwa | Add Lesson",
    description: "Create and add new lessons for Japanese learners.",
  };
}

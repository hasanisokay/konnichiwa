import {
  conflictResponse,
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const PUT = async (req) => {
  try {
    const body = await req.json();
    const { _id, changeLessonNumber, previousLessonNumber, ...updateFields } =
      body;
    const db = await dbConnect();
    const lessonCollection = await db.collection("lessons");
    const vocabularyCollection = await db.collection("vocabularies");
    const updatedFields = { ...updateFields, updatedOn: new Date() };
    
    
    if (changeLessonNumber){
      const lessonNumberNotAvailable = await lessonCollection.findOne({lessonNumber: updateFields.lessonNumber}) 
      if(lessonNumberNotAvailable){
        return conflictResponse("Lesson Number is already in use.")
      } 
    }
    const result = await lessonCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedFields }
    );
    if (changeLessonNumber) {
      await vocabularyCollection.updateMany(
        { lessonNumber: previousLessonNumber },
        { $set: { lessonNumber: updatedFields.lessonNumber } }
      );
      console.log({
        result,
        previousLessonNumber,
        r: updatedFields.lessonNumber,
      });
    }
    if (result?.modifiedCount === 0) {
      return serverErrorResponse("Lesson not found or no fields were updated");
    }
    return successResponse(result, "Lesson updated successfully");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

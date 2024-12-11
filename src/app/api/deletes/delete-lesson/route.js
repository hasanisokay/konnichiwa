import { serverErrorResponse, successResponse } from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const { _id, lessonNumber } = body; 
    const db = await dbConnect();
    const lessonCollection = db.collection("lessons");
    const vocabularyCollection = db.collection("vocabularies");

    // Delete the lesson
    const lessonResult = await lessonCollection.deleteOne(
      { _id: new ObjectId(_id) }
    );

    // Delete vocabularies associated with the lesson
    await vocabularyCollection.deleteMany(
      { lessonNumber }
    );

    if (lessonResult.deletedCount === 0) {
      return serverErrorResponse("Lesson not found or already deleted");
    }

    return successResponse(lessonResult,"Lesson and its vocabularies deleted successfully");
  } catch (e) {
    console.log(e)
    return serverErrorResponse(e.message);
  }
};

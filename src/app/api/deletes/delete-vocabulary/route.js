import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const { vocabularyId } = body;
    const db = await dbConnect();

    const vocabularyCollection = db.collection("vocabularies");

    const lessonResult = await vocabularyCollection.deleteOne({
      _id: new ObjectId(vocabularyId),
    });

    if (lessonResult.deletedCount === 0) {
      return serverErrorResponse("Vocabulary not found or already deleted");
    }

    return successResponse(lessonResult, "Vocabulary deleted successfully");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

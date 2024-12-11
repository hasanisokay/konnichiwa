import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const PUT = async (req) => {
  try {
    const body = await req.json();
    const { _id, ...updateFields } = body;
    const db = await dbConnect();
    const lessonCollection = await db.collection("lessons");
    const updatedFields = { ...updateFields, updatedOn: new Date() };
    const result = await lessonCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedFields }
    );

    if (result?.modifiedCount === 0) {
      return serverErrorResponse("Lesson not found or no fields were updated");
    }
    return successResponse(result, "Lesson updated successfully");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

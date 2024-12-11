import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { ObjectId } from "mongodb";

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const { tutorialId } = body;
    const db = await dbConnect();

    const tutorialCollection = db.collection("tutorials");

    const res = await tutorialCollection.deleteOne({
      _id: new ObjectId(tutorialId),
    });
    if (res.deletedCount === 0) {
      return serverErrorResponse("Tutorial not found or already deleted");
    }

    return successResponse(res, "Tutorial deleted successfully");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

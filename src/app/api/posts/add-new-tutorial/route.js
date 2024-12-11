import {
  conflictResponse,
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    const tutorialCollection = await db.collection("tutorials");
    body.createdOn = new Date();
    const res = await tutorialCollection.insertOne(body);
    return successResponse(
      { _id: res.insertedId },
      "Tutorial added successfully."
    );
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

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
    const vocabularyCollection = await db.collection("vocabularies");
    body.createdOn = new Date();
    const res = await vocabularyCollection.insertOne(body);
    return successResponse(
      { _id: res.insertedId },
      "Vocabulary added successfully."
    );
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

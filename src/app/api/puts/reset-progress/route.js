import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const PUT = async (req) => {
  try {
    const body = await req.json();
    const { userEmail } = body;
    const db = await dbConnect();
    const userCollection = await db.collection("users");
    const result = await userCollection.updateOne(
      { email: userEmail },
      { $set: {learnedLessons:[]} }
    );

    if (result?.modifiedCount === 0) {
      return serverErrorResponse("Data not found or no fields were updated");
    }
    return successResponse(result, "Data updated successfully");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

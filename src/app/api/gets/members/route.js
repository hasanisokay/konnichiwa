import { serverErrorResponse, successResponse } from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const GET = async (req) => {
  try {
    const db = await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const startDateStr = searchParams.get("fields");
    const membersCollection = await db.collection("members");
    const res = await membersCollection.find({}).toArray();
    return successResponse(res, "Members Found");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const db = await dbConnect();
    if (!db) return serverErrorResponse("Database error");
    const lessonCollection = await db.collection("lessons");
    const res = await lessonCollection
      .find({}, { projection: { lessonNumber: 1, lessonName:1, _id: 1 } })
      .toArray();

    return successResponse({lessonNumbers:res}, "Success");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

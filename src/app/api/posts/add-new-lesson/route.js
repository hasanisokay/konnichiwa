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
    const lessonCollection = await db.collection("lessons");
    const lessonNumber = await lessonCollection.findOne(
      { lessonNumber: body.lessonNumber },
      {
        projection: {
          _id: 1,
        },
      }
    );

    if (lessonNumber) {
      return conflictResponse(
        "Lesson number already asigned to another lesson."
      );
    } else {
      body.createdOn = new Date();
      const res = await lessonCollection.insertOne(body);

      return successResponse(
        { _id: res.insertedId },
        "Lesson added successfully."
      );
    }
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

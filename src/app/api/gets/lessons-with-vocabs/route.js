import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const sort = searchParams.get("sort");
    const lessonNumberStr = searchParams.get("lessonNumber");
    const lessonNumber = parseInt(lessonNumberStr);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;

    let skip = (page - 1) * limit;
    if (limit > 1000) {
      skip = 0;
    }
    const db = await dbConnect();

    if (!db) return serverErrorResponse("Database error");

    const matchStage = {};
    const lessonCollection = await db.collection("lessons");
    if (lessonNumber) {
      matchStage.lessonNumber = lessonNumber;
    }
    if (keyword) {
      matchStage.$or = [
        { lessonName: { $regex: keyword, $options: "i" } },
        { lessonNumber: { $regex: keyword, $options: "i" } },
        { adminEmail: { $regex: keyword, $options: "i" } },
      ];
    }
    const res = await lessonCollection
      .aggregate([
        { $match: matchStage },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "vocabularies",
            localField: "lessonNumber",
            foreignField: "lessonNumber",
            as: "vocabularies",
          },
        },
        {
          $project: {
            lessonName: 1,
            lessonNumber: 1,
            vocabularies: 1,
          },
        },
      ])
      .toArray();


    const totalCount = await lessonCollection.countDocuments(matchStage);

    return successResponse({ lessons: res, totalCount }, "Success");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

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
    const lessonNumber = searchParams.get("lesson_no");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;

    const skip = (page - 1) * limit;
    const db = await dbConnect();
    let sortOrder = -1;
    if (sort === "lesson_number_dsc") {
      sortOrder = 1;
    }
    if (!db) return serverErrorResponse("Database error");

    const matchStage = {};
    const vocabularyCollection = db.collection("vocabularies");

    if (keyword) {
      matchStage.$or = [
        { word: { $regex: keyword, $options: "i" } },
        { meaning: { $regex: keyword, $options: "i" } },
      ];
    }
    if (lessonNumber) {
      matchStage.lessonNumber = parseInt(lessonNumber); 
    }
    const res = await vocabularyCollection.find(matchStage)
      .sort({ lessonNumber: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await vocabularyCollection.countDocuments(matchStage);

    return successResponse({ vocabularies: res, totalCount }, "Success");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

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
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = (page - 1) * limit;
    const matchStage = {};
    let sortOrder = -1;
    if (sort === "oldest_first") {
      sortOrder = 1;
    }
    if (keyword) {
      matchStage.$or = [{ title: { $regex: keyword, $options: "i" } }];
    }
    const db = await dbConnect();
    if (!db) return serverErrorResponse("Database error");
    const tutorialCollection = await db.collection("tutorials");
    const res = await tutorialCollection
      .find(matchStage)
      .sort({ createdOn: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();
      const totalCount = await tutorialCollection.countDocuments(matchStage);
    return successResponse({ tutorials: res, totalCount }, "Success");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

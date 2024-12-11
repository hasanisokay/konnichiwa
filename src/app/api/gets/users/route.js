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
      matchStage.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }
    const db = await dbConnect();
    if (!db) return serverErrorResponse("Database error");
    const lessonCollection = await db.collection("users");
    const res = await lessonCollection
      .find(matchStage, {
        projection: { email: 1, name: 1, role: 1, status: 1 },
      })
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    return successResponse({ users: res }, "Success");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

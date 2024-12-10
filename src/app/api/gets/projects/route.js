import { serverErrorResponse, successResponse } from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("expiryDate");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const keyword = searchParams.get("keyword");

    const sort = searchParams.get("sort");

    const page = parseInt(searchParams.get("page"));
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const db = await dbConnect();

    if (!db) return serverErrorResponse("Database error");

    const matchStage = {};
const projectCollection = await db.collection("projects");
    // const sortField =
    //   sort === "highest" || sort === "lowest"
    //     ? "totalOrder" // Sort by totalOrder for both highest and lowest
    //     : sort === "name_asc" || sort === "name_dsc"
    //     ? "name" // Sort by name for ascending and descending
    //     : sort === "price_high" || sort === "price_low"
    //     ? report === "true"
    //       ? "sellingPrice"
    //       : "numericSellingPrice" // Conditional sorting for price
    //     : "lastModifiedTime"; // Default sort field

    let sortOrder = -1;
    // if (sort === "name_dsc" || sort === "lowest" || sort === "price_low") {
    //   sortOrder = 1;
    // }


    if (keyword) {
      matchStage.$or = [
        { note: { $regex: keyword, $options: "i" } },
        { projectName: { $regex: keyword, $options: "i" } },
        { '$members.name': { $regex: keyword, $options: "i" } },
      ];
    }

    const result = await projectCollection.find(matchStage).toArray()

    // t const successResponse = (data = {}, message = "Request successful")

    const totalCount = await projectCollection.countDocuments(matchStage);
    return successResponse( {projects: result,totalCount}, "Success")
  } catch {
    return serverErrorResponse()
  }
};

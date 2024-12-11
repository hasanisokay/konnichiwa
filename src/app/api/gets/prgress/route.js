import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    const db = await dbConnect();
    if (!db) return serverErrorResponse("Database error");
    const userCollection = await db.collection("users");
    const res = await userCollection
      .findOne({email}, { projection: { progress:1 } })

    return successResponse({res}, "Success");
  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

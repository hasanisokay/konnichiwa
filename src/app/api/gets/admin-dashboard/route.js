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
    const usersCollection = db.collection("users");
    const totalUsers = await usersCollection.countDocuments();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 
    const usersJoinedToday = await usersCollection.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const lessonsCollection = db.collection("lessons");
    const totalLessons = await lessonsCollection.countDocuments();
    const vocabulariesCollection = db.collection("vocabularies");
    const totalVocabularies = await vocabulariesCollection.countDocuments();

    return successResponse({
      totalUsers,
      usersJoinedToday,
      totalLessons,
      totalVocabularies,
    }, "Success");

  } catch (e) {
    console.log(e);
    return serverErrorResponse(e.message);
  }
};

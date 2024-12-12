import {
    noChangesMadeResponse,
    serverErrorResponse,
    successResponse,
  } from "@/constants/routeResponses.mjs";
  import dbConnect from "@/services/dbConnect.mjs";
  
  export const POST = async (req) => {
    try {
      const body = await req.json();
      const { email, learnedLesson } = body;
      const db = await dbConnect();
      const userCollection = await db.collection("users");
      const res = await userCollection.updateOne(
        { email },
        { $addToSet: { learnedLesson } }
      );
  
      if (res.modifiedCount === 0) {
        return noChangesMadeResponse("Keep up the practice with the same word.")
      }
  
      return successResponse(res, "Congratulations on learning new words!");
    } catch (e) {
      return serverErrorResponse(e.message);
    }
  };
  
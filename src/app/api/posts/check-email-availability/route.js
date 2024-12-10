import {
  serverErrorResponse,
  successResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    const userCollection = await db.collection("users");
    const existingUser = await userCollection.findOne(
      { email: body.email },
      {
        projection: {
          _id: 1,
        },
      }
    );

    if (existingUser) {
      return NextResponse.json({
        message: "Email already is in use.",
        status: 200,
        emailAvailable: false,
      });
    } else {
      return NextResponse.json({
        message: "Email is not in use.",
        status: 200,
        emailAvailable: true,
      });
    }
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

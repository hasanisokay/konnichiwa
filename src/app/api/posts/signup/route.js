import {
  serverErrorResponse,
  successResponse,
  invalidCredentialsResponse,
} from "@/constants/routeResponses.mjs";
import bcrypt from "bcrypt";
import dbConnect from "@/services/dbConnect.mjs";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, password, name, photoUrl } = body;
    const db = await dbConnect();
    const userCollection = await db.collection("users");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      photoUrl,
      password: hashedPassword,
      role: "user",
      status: "active",
      createdAt: new Date(),
    };
    const result = await userCollection.insertOne(newUser);
    if (!result.acknowledged) {
      throw new Error("Failed to create user.");
    }

    return successResponse(
      { id: result.insertedId, email, name },
      "Signup successful."
    );
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

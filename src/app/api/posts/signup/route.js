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
    const { username, email, password, name } = body;
    const db = await dbConnect();
    const userCollection = await db.collection("users");

    const existingUser = await userCollection.findOne(
      { email },
      {
        projection: {
          _id: 1,
        },
      }
    );

    if (existingUser) {
      return invalidCredentialsResponse("Email already exists.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      name,
      role: "user", 
      status: "active", 
      createdAt: new Date(),
    };
    const result = await userCollection.insertOne(newUser);
    if (!result.acknowledged) {
      throw new Error("Failed to create user.");
    }

    return successResponse(
      { id: result.insertedId, username, email, name },
      "Signup successful."
    );
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};

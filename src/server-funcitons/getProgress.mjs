"use server";

import dbConnect from "@/services/dbConnect.mjs";
import { verifyToken } from "@/utils/verifyToken.mjs";

const getProgress = async (e) => {
  try {
    let userEmail = e;
    if (!userEmail) {
      const payload = await verifyToken();
      if (payload) {
        const { email } = payload;
        userEmail = email;
      }
    }
    const db = await dbConnect();
    const userCollection = await db.collection("users");
    const res = await userCollection.findOne(
      { email: userEmail },
      { projection: { _id: 1, learnedLessons: 1 } }
    );

    return res.learnedLessons || [];
  } catch {
    return [];
  }
};

export default getProgress;

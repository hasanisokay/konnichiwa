"use server";

import dbConnect from "@/services/dbConnect.mjs";
import { verifyToken } from "@/utils/verifyToken.mjs";

const getProgress = async (e) => {
  let userEmail = e;
  if (!userEmail) {
    const { email } = await verifyToken();
    userEmail = email;
  }
  const db = await dbConnect();
  const userCollection = await db.collection("users");
  const res = await userCollection.findOne(
    { email: userEmail },
    { projection: { _id: 1, learnedLessons: 1 } }
  );

  return res.learnedLessons || [];
};

export default getProgress;

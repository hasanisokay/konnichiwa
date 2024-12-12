"use server";

import dbConnect from "@/services/dbConnect.mjs";
import logOut from "@/utils/logOut.mjs";
import { verifyToken } from "@/utils/verifyToken.mjs";

const revalidateToken = async () => {
  try {
    const payload = await verifyToken();
    if (!payload) {
      console.error("Invalid token or payload is null");
      return;
    }

    const { role, status, email } = payload;
    const db = await dbConnect();
    const userCollection = await db.collection("users");
    const res = await userCollection.findOne(
      { email },
      {
        projection: {
          _id: 1,
          email: 1,
          status: 1,
          role: 1,
        },
      }
    );
    if(!res){
      logOut();
    }
    if (res?.status !== status || res?.role !== role) {
      logOut();
      return { check: false, message: "Information mismatch. logging out..." };
    } else {
      return { message: "User information is ok.", check: true };
    }
  } catch (e) {
    console.log(e)
    return null
  }
};

export default revalidateToken;

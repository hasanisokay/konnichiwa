"use server"
// import { TOKEN_COOKIE } from "@/constants/constantNames.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import logOut from "@/utils/logOut.mjs";
import { verifyToken } from "@/utils/verifyToken.mjs";
// import { SignJWT } from "jose";
// import { cookies } from "next/headers";
const revalidateToken = async () => {
  const payload = await verifyToken();
  if(!payload) return;
  const { role, status, email, name, photoUrl } = payload; 
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
  if (res.status !== status || res.role !== role) {
    logOut();
    // const secret = new TextEncoder().encode(process.env.JWT_ENCRYPTION_KEY);
    // const token = await new SignJWT({
    //   sub: res._id,
    //   name: name,
    //   email: email,
    //   status: res.status,
    //   role: res.role,
    //   photoUrl: photoUrl,
    // })
    //   .setProtectedHeader({ alg: "HS256" })
    //   .setIssuedAt()
    //   .setExpirationTime("365d")
    //   .sign(secret);
    // (await cookies()).set({
    //   name: TOKEN_COOKIE,
    //   value: `Bearer ${token}`,
    //   httpOnly: true,
    //   sameSite: "strict",
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 24 * 60 * 60 * 7,
    // });
    return { check: false, message: "Information mismatch. logging out..." };
  } else {
    return { message: "User information is ok.", check: true };
  }
};

export default revalidateToken;

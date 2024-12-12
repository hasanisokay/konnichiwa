'use server'
import { TOKEN_COOKIE } from "@/constants/constantNames.mjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const logOut = async () => {
    let cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE);  
    return NextResponse.redirect("/login");
};

export default logOut;

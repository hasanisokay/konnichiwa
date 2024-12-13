'use server'
import { TOKEN_COOKIE } from "@/constants/constantNames.mjs";
import { cookies } from "next/headers";

const logOut = async (request) => {
    let cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE);  
    return
};

export default logOut;

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import StoreProvider from "@/store/StoreProvider";
import getThemeCookie from "@/utils/getThemeCookie.mjs";
import { verifyToken } from "@/utils/verifyToken.mjs";
import { makeStore } from "@/store/store";
import { setUserData } from "@/store/slices/authSlice";
import { setTheme } from "@/store/slices/themeSlice";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Footer from "@/components/nav/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Learn Japanese",
  description: "Generated by Hasn",
};

export default async function RootLayout({ children }) {
  let storedTheme = await getThemeCookie();
  let userData = await verifyToken();
  const store = makeStore();
  store.dispatch(setUserData(userData));
  store.dispatch(setTheme(storedTheme));
  const initialReduxState = store.getState();
  console.log(userData)
  return (
    <StoreProvider initialReduxState={initialReduxState}>
      <ThemeProvider>
        <html lang="en" data-theme={storedTheme}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <div className="min-h-screen">
            <Navbar />
            {children}
            </div>
            <Footer />
            <ToastContainer transition={Zoom} />
          </body>
        </html>
      </ThemeProvider>
    </StoreProvider>
  );
}

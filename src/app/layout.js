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
import hostname from "@/constants/hostname.mjs";

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
export async function generateMetadata() {
  const host = await hostname();

  return {
    title: "Konnichiwa | Home",
    description:
      "Learn Japanese with Konnichiwa! Your go-to platform for mastering the Japanese language through interactive lessons and engaging content.",
    publisher: "Hasan",
    keywords: [
      "learn-japanese",
      "Japanese language",
      "language learning",
      "Konnichiwa",
    ],
    other: {
      "color-scheme": ["dark", "light"],
      "twitter:image": "https://i.ibb.co/QQknMBw/konnichiwa.png",
      "twitter:card": "summary_large_image",
      "twitter:title": "Konnichiwa | Home",
      "twitter:description":
        "Learn Japanese with Konnichiwa! Discover interactive lessons, engaging content, and a vibrant community.",
      "og:title": "Konnichiwa | Home",
      "og:url": `${host}`,
      "og:image": "https://i.ibb.co/QQknMBw/konnichiwa.png",
      "og:description":
        "Join Konnichiwa to master the Japanese language with ease. Explore our interactive platform for language learners.",
      "og:type": "website",
      "og:site_name": "Konnichiwa",
      "og:locale": "en_US",
      "og:updated_time": new Date().toISOString(),
    },
  };
}

export default async function RootLayout({ children }) {
  let storedTheme = await getThemeCookie();
  let userData = await verifyToken();
  const store = makeStore();
  store.dispatch(setUserData(userData));
  store.dispatch(setTheme(storedTheme));
  const initialReduxState = store.getState();

  return (
    <StoreProvider initialReduxState={initialReduxState}>
      <ThemeProvider>
        <html lang="en" data-theme={storedTheme}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <div className="min-h-screen ">
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

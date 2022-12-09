import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface PropsIfc {
  children: React.ReactNode;
}
const Layout = (props: PropsIfc) => {
  const cookie = new Cookies();
  const [jwtToken, setJwtToken] = useState("");
  useEffect(() => {
    setJwtToken(cookie.get("access_token"));
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col justify-between">
      <div>
        <Header></Header>
        <div className="flex justify-between h-full">
          <div className="w-2/3 px-7 py-10">
            <div className="mx-auto max-w-5xl">
              {jwtToken && (
                <button className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-3 rounded-md">
                  <Link href={"/create"}>新規投稿</Link>
                </button>
              )}
              {props.children}
            </div>
          </div>
          <div className="w-1/3 px-7 py-10 h-full">
            <Sidebar></Sidebar>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Layout;

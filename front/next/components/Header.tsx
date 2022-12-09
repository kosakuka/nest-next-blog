import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const Header = () => {
  const cookie = new Cookies();
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState("");
  useEffect(() => {
    setJwtToken(cookie.get("access_token"));
  }, []);

  return (
    <div className="bg-indigo-500 text-slate-100 h-24 top-0 w-full flex items-center">
      <div className="flex flex-row items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/">
          <h1 className="text-5xl font-black italic">My Blog</h1>
        </Link>
        {jwtToken ? (
          <div
            className="text-slate-100 hover:cursor-pointer"
            onClick={async (e) => {
              await router.push("/");
              cookie.remove("access_token");
              router.reload();
            }}
          >
            ログアウト
          </div>
        ) : (
          <div
            className="text-slate-100 hover:cursor-pointer"
            onClick={(e) => {
              router.push("/admin");
            }}
          >
            管理者ログイン
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

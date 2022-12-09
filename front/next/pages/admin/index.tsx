import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Cookies from "universal-cookie";
import { IErrorResponse } from "../../utils/error.interface";

const AdminLogin: NextPage = () => {
  const cookie = new Cookies();
  const router = useRouter();
  const [login_id, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center">
      <Head>
        <title>管理者ログイン / My Blog</title>
      </Head>
      <h1 className="text-indigo-600 text-5xl font-black mb-7">For Admin</h1>
      <form
        className="flex flex-col w-96"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const result = await axios.post(
              `${process.env.NEXT_PUBLIC_API_DOMAIN}/admin/signin`,
              {
                login_id,
                password,
              }
            );
            const jwtToken = result.data.access_token;

            const option = { path: "/" }; //トークンが指定のURL以下で有効になる
            cookie.set("access_token", jwtToken, option); // トークンをブラウザのcookieに格納する。

            router.push("/"); // 記事一覧ページに移動
          } catch (e) {
            if (
              (e as AxiosError<IErrorResponse>).response &&
              (e as AxiosError<IErrorResponse>).response!.status === 400 ||
              (e as AxiosError<IErrorResponse>).response!.status === 403 ||
              (e as AxiosError<IErrorResponse>).response!.status === 404
            ) {
              alert(
                (e as AxiosError<IErrorResponse>).response!.data.message.join(
                  "\n"
                )
              );
            } else {
              alert("エラーが発生しました。");
            }
          }
        }}
      >
        <p className="text-2xl">Login ID</p>
        <input
          type="text"
          className="p-2 rounded-md bg-slate-300 italic outline-none mb-7"
          placeholder="Login Id"
          value={login_id}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <p className="text-2xl">Password</p>
        <input
          type="password"
          className="p-2 rounded-md bg-slate-300 italic outline-none mb-14"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="submit"
          value="Login"
          className="px-6 py-2 bg-indigo-600 rounded-md text-slate-100 text-2xl hover:bg-indigo-500 hover:cursor-pointer"
        />
      </form>
    </div>
  );
};

export default AdminLogin;

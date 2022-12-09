import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { IErrorResponse } from "../utils/error.interface";
import Layout from "./Layout";
import Redirect from "./Redirect";

interface PropsIfc {
  id?: number;
  titleInitValue: string;
  contentInitValue: string;
  mode: string;
}
const BlogForm = (props: PropsIfc) => {
  const cookie = new Cookies();
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [title, setTitle] = useState<string>(props.titleInitValue);
  const [content, setContent] = useState<string>(props.contentInitValue);

  useEffect(() => {
    setJwtToken(cookie.get("access_token"));
    if (props.mode === "create") {
      setPageTitle("新規投稿ページ");
    } else {
      setPageTitle("投稿更新ページ");
    }
  }, []);

  return (
    <>
      {jwtToken ? (
        <Layout>
          <h1 className="text-2xl font-bold mb-5 text-center text-indigo-600">
            {pageTitle}
          </h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (props.mode === "create") {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/blogs`,
                    {
                      title,
                      content,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                      },
                    }
                  );
                } else if (props.mode === "update") {
                  await axios.put(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/blogs/${props.id}`,
                    {
                      title,
                      content,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                      },
                    }
                  );
                }
                alert("投稿成功");
                router.push("/");
              } catch (e) {
                if (
                  (e as AxiosError<IErrorResponse>).response &&
                  (e as AxiosError<IErrorResponse>).response!.status === 401
                ) {
                  alert("認証情報が正しくありません。");
                } else if (
                  (e as AxiosError<IErrorResponse>).response &&
                  (e as AxiosError<IErrorResponse>).response!.status === 400
                ) {
                  alert(
                    (
                      e as AxiosError<IErrorResponse>
                    ).response!.data.message.join("\n")
                  );
                } else {
                  alert("エラーが発生しました。");
                }
              }
            }}
          >
            <h1 className="text-2xl font-bold my-1">タイトル</h1>
            <input
              type="text"
              className="bg-slate-200 rounded-md py-2 px-5 outline-none w-3/4"
              placeholder="title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <h1 className="text-2xl font-bold mb-1 mt-5">内容</h1>
            <textarea
              className="bg-slate-200 rounded-md py-2 px-5 outline-none w-3/4 h-96 resize-none"
              onChange={(e) => setContent(e.target.value)}
              placeholder="content..."
              defaultValue={content}
            ></textarea>
            <input
              type="submit"
              value="投稿"
              className="bg-blue-500 hover:bg-blue-400 text-white py-1 px-3 my-3 rounded-md block"
            />
          </form>
        </Layout>
      ) : (
        <Redirect alertMsg="ログインしてください。"></Redirect>
      )}
    </>
  );
};

export default BlogForm;

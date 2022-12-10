import axios, { AxiosError } from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Layout from "../components/Layout";
import { Blog } from "../utils/blog.interface";
import { IErrorResponse } from "../utils/error.interface";

interface PropsIfc {
  blog: Blog;
}

const Blog: NextPage<PropsIfc> = (props) => {
  const cookie = new Cookies();
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState<string>("");
  useEffect(() => {
    setJwtToken(cookie.get("access_token"));
  }, []);

  // ブログの本文を改行ありで表示させる
  // そのためには、propsで渡される本文(props.blog.content)を \n で分割して配列にした後、
  // 各要素にindexを設けた連想配列にする必要がある。それを、各要素をpタグで囲み、画面に表示する。
  const contentArray = props.blog.content.split("\n");
  const contentArrayWithIndex: { id: number; content: string }[] = [];
  for (let index = 0; index < contentArray.length; index++) {
    contentArrayWithIndex.push({ id: index, content: contentArray[index] });
  }

  return (
    <div>
      <Head>
        <title>{props.blog.title} / My Blog</title>
      </Head>
      <Layout>
        <div className="h-36">
          {jwtToken && (
            <>
              <button
                className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await axios.delete(
                      `${process.env.NEXT_PUBLIC_API_DOMAIN}/blogs/${props.blog.id}`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${jwtToken}`,
                        },
                      }
                    );
                    alert("削除成功");
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
                削除
              </button>

              <button
                className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-md ml-2"
                onClick={async (e) => {
                  e.preventDefault();
                  router.push(`/update/${props.blog.id}`);
                }}
              >
                更新
              </button>
            </>
          )}
          <p className="italic">{props.blog.createdAt.toLocaleString()}</p>
          <h1 className="text-2xl font-bold my-1">{props.blog.title}</h1>
          {contentArrayWithIndex.map((ele) => (
            <p key={ele.id} className="break-words">
              {ele.content}
            </p>
          ))}
        </div>
      </Layout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PropsIfc> = async (
  context
) => {
  // ↓ params?によって、idが存在しない場合はundefineとなる
  const id =
    (Array.isArray(context.params?.id)
      ? context.params?.id[0]
      : context.params?.id) || "";

  const result = await axios.get(`${process.env.API_DOMAIN}/blogs/${id}`);
  const blog: Blog = result.data;

  return {
    props: { blog },
  };
};

export default Blog;

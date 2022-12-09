import { NextPage } from "next";
import Head from "next/head";
import BlogForm from "../components/BlogForm";

const Create: NextPage = () => {
  return (
    <>
      <Head>
        <title>新規投稿 / My Blog</title>
      </Head>
      <BlogForm mode="create" contentInitValue="" titleInitValue=""></BlogForm>
    </>
  );
};

export default Create;

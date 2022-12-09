import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import BlogForm from "../../components/BlogForm";
import { Blog } from "../../utils/blog.interface";

interface PropsIfc {
  blog: Blog;
}

const Update: NextPage<PropsIfc> = (props: PropsIfc) => {
  return (
    <>
      <Head>
        <title>投稿更新ページ / My Blog</title>
      </Head>
      <BlogForm
        id={props.blog.id}
        mode="update"
        titleInitValue={props.blog.title}
        contentInitValue={props.blog.content}
      ></BlogForm>
    </>
  );
};

export default Update;

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

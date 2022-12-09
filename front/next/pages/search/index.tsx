import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Blog } from "../../utils/blog.interface";

interface PropsIfc {
  blogs: Blog[];
  searchQuery: string;
}

const Home: NextPage<PropsIfc> = (props) => {
  return (
    <div>
      <Head>
        <title>{props.searchQuery}の検索結果 / My Blog</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-bold mb-5 text-center text-indigo-600">
          {props.searchQuery}の検索結果
        </h1>
        {props.blogs.map((blog) => (
          <Link key={blog.id} href={`/${blog.id}`}>
            <div className="h-36 hover:ml-4 transition-all">
              <p className="italic">{blog.createdAt.toLocaleString()}</p>
              <h1 className="text-2xl font-bold my-1">{blog.title}</h1>
              <p className="break-words">
                {blog.content ? blog.content.substr(0, 100) : ""}...
              </p>
            </div>
          </Link>
        ))}
      </Layout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PropsIfc> = async (
  context
) => {
  const searchQuery = (context.query.q || "") as string; // 検索キーワードが空白で分割された文字列
  const result = await axios.get(
    `${process.env.API_DOMAIN}/blogs?q=${searchQuery.replace(" ", "+")}`
  );
  const blogs = result.data;

  return {
    props: { blogs, searchQuery },
  };
};

export default Home;

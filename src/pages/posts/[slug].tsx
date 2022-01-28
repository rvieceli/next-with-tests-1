import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { RichText, RichTextBlock } from 'prismic-reactjs';
import { getPrismicClient } from 'app/services/prismic';
import { Post } from 'app/feature/Post/Post';

type PostData = {
  slug: string;
  publication_date: string;
  title: string;
  content: RichTextBlock[];
};

interface PostProps {
  post: PostData;
}

const PostPage = ({ post }: PostProps) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Post post={post} />
    </>
  );
};

interface PrismicPost {
  title: RichTextBlock[];
  content: RichTextBlock[];
}

const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const slug = String(params?.slug);

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID<PrismicPost>('posts', slug, {});

  const post: PostData = {
    slug,
    publication_date: response.last_publication_date!,
    title: RichText.asText(response.data.title),
    content: response.data.content,
  };

  return {
    props: {
      post,
    },
  };
};

export default PostPage;

export { getServerSideProps };

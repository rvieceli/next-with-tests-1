import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'services/nextAuth';
import Head from 'next/head';
import { RichText, RichTextBlock } from 'prismic-reactjs';
import { getPrismicClient } from 'services/prismic';
import { Preview } from 'feature/Post/Preview';

const REVALIDATE = 60 * 30; // 30 minutes

type PostData = {
  slug: string;
  publication_date: string;
  title: string;
  content: RichTextBlock[];
};

interface PostPreviewProps {
  post: PostData;
}

const PostPreviewPage = ({ post }: PostPreviewProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Preview post={post} />
    </>
  );
};

interface PrismicPost {
  title: RichTextBlock[];
  content: RichTextBlock[];
}

const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);

  const prismic = getPrismicClient();

  const response = await prismic.getByUID<PrismicPost>('posts', slug, {});

  const limitedContent = response.data.content.slice(0, 3);

  const post: PostData = {
    slug,
    publication_date: response.last_publication_date!,
    title: RichText.asText(response.data.title),
    content: limitedContent,
  };

  return {
    props: {
      post,
    },
    revalidate: REVALIDATE,
  };
};

export default PostPreviewPage;

export { getStaticProps, getStaticPaths };

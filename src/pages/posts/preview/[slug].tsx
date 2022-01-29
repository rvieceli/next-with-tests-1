import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'app/services/nextAuth';
import Head from 'next/head';
import { RichText, RichTextBlock } from 'prismic-reactjs';
import { getPrismicClient } from 'app/services/prismic';
import { Preview } from 'app/feature/Post/Preview';

const REVALIDATE = 60 * 30; // 30 minutes
export const CONTENT_LIMIT = 3;

export type PostData = {
  slug: string;
  publication_date: string;
  title: string;
  content: RichTextBlock[];
};

export interface PostPreviewProps {
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

export interface PrismicPost {
  title: RichTextBlock[];
  content: RichTextBlock[];
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);

  const prismic = getPrismicClient();

  const response = await prismic.getByUID<PrismicPost>('posts', slug, {});

  const limitedContent = response.data.content.slice(0, CONTENT_LIMIT);

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

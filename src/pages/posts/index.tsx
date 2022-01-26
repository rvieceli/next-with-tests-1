import { useCallback } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText, Date as DateParser, RichTextBlock } from 'prismic-reactjs';
import { getPrismicClient, Prismic } from 'services/prismic';
import { useSession } from 'services/nextAuth';
import styles from './posts.module.scss';

const PAGE_SIZE = 10;

type Post = {
  slug: string;
  publication_date: string;
  title: string;
  content: string;
};

interface PostsProps {
  posts: Post[];
}

const Posts = function ({ posts }: PostsProps) {
  const { data: session } = useSession();

  const path = useCallback(
    (slug: string) => {
      if (session?.activeSubscription) {
        return `/posts/${slug}`;
      }
      return `/posts/preview/${slug}`;
    },
    [session]
  );

  return (
    <>
      <Head>
        <title>ignews | Posts</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.post}>
          {posts?.map((post) => (
            <Link key={post.slug} href={path(post.slug)}>
              <a>
                <time>
                  {DateParser(post.publication_date).toLocaleDateString(
                    undefined,
                    { dateStyle: 'long' }
                  )}
                </time>

                <strong>{post.title}</strong>
                <p>{post.content}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

interface PrismicPost {
  title: RichTextBlock[];
  content: RichTextBlock[];
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query<PrismicPost>(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: PAGE_SIZE,
      graphQuery: `{
         posts {
           title
           content
          }
        }`,
    }
  );

  const posts = response.results.map(({ uid, last_publication_date, data }) => {
    const firstContentParagraph = data.content.find(
      (el) => el.type === 'paragraph'
    );

    const content = firstContentParagraph
      ? RichText.asText([firstContentParagraph])
      : '';

    return {
      slug: uid,
      publication_date: last_publication_date!,
      title: RichText.asText(data.title),
      content,
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Posts;

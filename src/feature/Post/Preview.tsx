import Link from 'next/link';
import { RichText, RichTextBlock, Date as DateParser } from 'prismic-reactjs';
import styles from './Post.module.scss';

type PostData = {
  slug: string;
  publication_date: string;
  title: string;
  content: RichTextBlock[];
};

interface PreviewProps {
  post: PostData;
}

const Preview = ({ post }: PreviewProps) => {
  return (
    <main className={styles.container}>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>
          {DateParser(post.publication_date).toLocaleDateString(undefined, {
            dateStyle: 'long',
          })}
        </time>
        <div className={`${styles.content} ${styles.previewContent}`}>
          <RichText render={post.content} />
        </div>
        <div className={styles.continueReading}>
          Wanna continue reading?
          <Link href="/">
            <a>Subscribe now 🤗</a>
          </Link>
        </div>
      </article>
    </main>
  );
};

export { Preview };

import { RichText, RichTextBlock, Date as DateParser } from 'prismic-reactjs';
import styles from './Post.module.scss';

type PostData = {
  slug: string;
  publication_date: string;
  title: string;
  content: RichTextBlock[];
};

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  return (
    <main className={styles.container}>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>
          {DateParser(post.publication_date).toLocaleDateString(undefined, {
            dateStyle: 'long',
          })}
        </time>
        <div className={styles.content}>
          <RichText render={post.content} />
        </div>
      </article>
    </main>
  );
};

export { Post };

import { render, screen, waitFor } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/react';
import PostPage, {
  getStaticProps,
  CONTENT_LIMIT,
} from 'app/pages/posts/preview/[slug]';
import type {
  PrismicPost,
  PostPreviewProps,
  PostData,
} from 'app/pages/posts/preview/[slug]';

import { getPrismicClient } from 'app/services/prismic';
import { mocked } from 'jest-mock';
import { Elements } from 'prismic-reactjs';
import { GetStaticPropsResult } from 'next';
import { useRouter } from 'next/router';

jest.mock('next-auth/react');
jest.mock('next/router');
jest.mock('app/services/prismic');

const post: PostData = {
  slug: 'some-1',
  title: 'Some title',
  content: [
    { type: Elements.heading1, text: 'Content Title', spans: [] },
    { type: Elements.paragraph, text: 'Some post content', spans: [] },
    { type: Elements.paragraph, text: 'Some post content 2', spans: [] },
    { type: Elements.paragraph, text: 'Some post content 3', spans: [] },
    { type: Elements.paragraph, text: 'Some post content 4', spans: [] },
  ],
  publication_date: '2021-10-22',
};

describe('Post preview page (public access)', () => {
  it('renders', async () => {
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<PostPage post={post} />);

    expect(await screen.findByText(/22 October 2021/i)).toBeInTheDocument();
    expect(await screen.findByText('Some title')).toBeInTheDocument();
    expect(await screen.findByText('Content Title')).toBeInTheDocument();
    expect(await screen.findByText('Some post content')).toBeInTheDocument();
    expect(await screen.findByText(/Subscribe now/)).toBeInTheDocument();
  });

  it('redirects to full post content when user is authenticated and has a subscription', async () => {
    mocked(useSession).mockReturnValueOnce({
      data: {
        user: { name: 'Some name' },
        activeSubscription: 'valid subscription',
        expires: 'future',
      },
      status: 'authenticated',
    });

    const push = jest.fn();

    mocked(useRouter).mockReturnValueOnce({
      push,
    } as any);

    render(<PostPage post={post} />);

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(`/posts/${post.slug}`)
    );
  });

  it('loads static server props', async () => {
    mocked(getPrismicClient).mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: 'some-slug',
        last_publication_date: '2021-10-14',
        data: {
          title: [{ type: 'heading1', text: 'Some title' }],
          content: post.content,
        } as PrismicPost,
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: 'some-slug' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining<GetStaticPropsResult<PostPreviewProps>>({
        props: {
          post: {
            slug: 'some-slug',
            title: 'Some title',
            content: post.content.slice(0, CONTENT_LIMIT),
            publication_date: '2021-10-14',
          },
        },
      })
    );
  });
});

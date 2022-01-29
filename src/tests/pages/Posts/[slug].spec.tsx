import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import type { GetServerSidePropsResult } from 'next';

import { getSession } from 'next-auth/react';
import { Elements } from 'prismic-reactjs';

import PostPage, { getServerSideProps } from 'app/pages/posts/[slug]';
import type { PrismicPost, PostProps, PostData } from 'app/pages/posts/[slug]';

import { getPrismicClient } from 'app/services/prismic';

jest.mock('next-auth/react');
jest.mock('app/services/prismic');

const post: PostData = {
  slug: 'some-1',
  title: 'Some title',
  content: [
    { type: Elements.heading1, text: 'Content Title', spans: [] },
    { type: Elements.paragraph, text: 'Some post content', spans: [] },
  ],
  publication_date: '2021-10-22',
};

describe('Post page (subscribed users only)', () => {
  it('renders', async () => {
    render(<PostPage post={post} />);

    expect(await screen.findByText(/22 October 2021/i)).toBeInTheDocument();
    expect(await screen.findByText('Some title')).toBeInTheDocument();
    expect(await screen.findByText('Content Title')).toBeInTheDocument();
    expect(await screen.findByText('Some post content')).toBeInTheDocument();
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

    mocked(getSession).mockResolvedValueOnce({
      user: { name: 'Some User' },
      activeSubscription: 'whatever',
      expires: 'future',
    });

    const response = await getServerSideProps({
      params: { slug: 'some-slug' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining<GetServerSidePropsResult<PostProps>>({
        props: {
          post: {
            slug: 'some-slug',
            title: 'Some title',
            content: post.content,
            publication_date: '2021-10-14',
          },
        },
      })
    );
  });

  it("redirects to preview when user is unauthenticated or doesn't have a subscription", async () => {
    mocked(getSession).mockResolvedValueOnce({
      activeSubscription: undefined,
      expires: '',
    });

    const response = await getServerSideProps({
      params: { slug: 'some-slug' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining<GetServerSidePropsResult<PostProps>>({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });
});

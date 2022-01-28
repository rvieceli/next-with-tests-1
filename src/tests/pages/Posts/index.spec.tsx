import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import PostsPage, { getStaticProps } from 'app/pages/posts/index';
import type { PrismicPost, PostsProps, Post } from 'app/pages/posts/index';

import { getPrismicClient } from 'app/services/prismic';
import { mocked } from 'jest-mock';

jest.mock('next-auth/react');
jest.mock('app/services/prismic');

const posts: Post[] = [
  {
    slug: 'some-1',
    title: 'Some title',
    content: 'Some content',
    publication_date: '2021-10-22',
  },
  {
    slug: 'any-2',
    title: 'Any title',
    content: 'Any content',
    publication_date: '2021-10-02',
  },
];

describe('Home page', () => {
  it('renders', async () => {
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<PostsPage posts={posts} />);

    expect(await screen.findByText(/22 October 2021/i)).toBeInTheDocument();
    expect(await screen.findByText('Some title')).toBeInTheDocument();
    expect(await screen.findByText('Any title')).toBeInTheDocument();

    const link = await screen.findAllByTestId('Post-link');

    expect(link[0]).toHaveAttribute('href', `/posts/preview/${posts[0].slug}`);
    expect(link[1]).toHaveAttribute('href', `/posts/preview/${posts[1].slug}`);
  });

  it('renders with links to complete posts when user has a subscription', async () => {
    mocked(useSession).mockReturnValueOnce({
      data: {
        user: { name: 'Some User' },
        activeSubscription: 'whatever',
        expires: 'future',
      },

      status: 'authenticated',
    });

    render(<PostsPage posts={posts} />);

    expect(await screen.findByText(/22 October 2021/i)).toBeInTheDocument();
    expect(await screen.findByText('Some title')).toBeInTheDocument();
    expect(await screen.findByText('Any title')).toBeInTheDocument();

    const link = await screen.findAllByTestId('Post-link');

    expect(link[0]).toHaveAttribute('href', `/posts/${posts[0].slug}`);
    expect(link[1]).toHaveAttribute('href', `/posts/${posts[1].slug}`);
  });

  it('loads static props', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'some-slug',
            last_publication_date: '2021-10-14',
            data: {
              title: [{ type: 'heading1', text: 'Some title' }],
              content: [{ type: 'paragraph', text: 'First paragraph' }],
            } as PrismicPost,
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining<{ props: PostsProps }>({
        props: {
          posts: [
            {
              slug: 'some-slug',
              title: 'Some title',
              content: 'First paragraph',
              publication_date: '2021-10-14',
            },
          ],
        },
      })
    );
  });
});

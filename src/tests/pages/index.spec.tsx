import { render, screen } from '@testing-library/react';

import HomePage, { getStaticProps } from 'app/pages/index';
import type { HomeProps } from 'app/pages/index';

import { stripe } from 'app/services/stripe';
import { mocked } from 'jest-mock';
import { GetStaticPropsResult } from 'next';

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'loading',
  }),
}));
jest.mock('app/services/stripe');

describe('Home page', () => {
  it('renders', async () => {
    render(<HomePage product={{ amount: 9.9, currency: 'EUR' }} />);

    expect(await screen.findByText(/€9\.90/)).toBeInTheDocument();
  });

  it('loads static props', async () => {
    const stripeRetrievePricesMocked = mocked(stripe.prices.retrieve);

    stripeRetrievePricesMocked.mockResolvedValueOnce({
      unit_amount: 990,
      currency: 'EUR',
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining<GetStaticPropsResult<HomeProps>>({
        props: {
          product: {
            amount: 9.9,
            currency: 'EUR',
          },
        },
      })
    );
  });
});

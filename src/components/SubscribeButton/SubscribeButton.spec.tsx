import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { api } from 'app/services/api';
import { getStripeJs } from 'app/services/stripe-js';
import { mocked, spyOn } from 'jest-mock';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from './SubscribeButton';

jest.mock('next-auth/react');
jest.mock('next/router');
jest.mock('app/services/api');
jest.mock('app/services/stripe-js');

describe('SubscribeButton component', () => {
  it('should render Subscribe Now button', () => {
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  });

  it('should redirect to signIn if user is not authenticated', () => {
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SubscribeButton />);

    const button = screen.getByTestId('SubscribeNow-button');

    fireEvent.click(button);

    expect(mocked(signIn)).toHaveBeenCalledWith('github');
  });

  it('should redirect to posts when user already has a subscription', () => {
    mocked(useSession).mockReturnValueOnce({
      data: {
        user: { name: 'Paid User' },
        activeSubscription: 'whatever',
        expires: '',
      },
      status: 'authenticated',
    });

    const push = jest.fn();

    mocked(useRouter).mockReturnValueOnce({
      push,
    } as any);

    render(<SubscribeButton />);

    const button = screen.getByTestId('SubscribeNow-button');

    fireEvent.click(button);

    expect(push).toHaveBeenCalledWith('/posts');
  });

  it('should call api and redirects to stripe', async () => {
    mocked(useSession).mockReturnValueOnce({
      data: {
        user: { name: 'Paid User' },
        activeSubscription: undefined,
        expires: '',
      },
      status: 'authenticated',
    });

    const sessionId = 'some-session-id';

    const post = spyOn(api, 'post').mockResolvedValueOnce({
      data: {
        sessionId,
      },
    });

    const redirectToCheckout = jest.fn();

    mocked(getStripeJs).mockReturnValueOnce({
      redirectToCheckout,
    } as any);

    render(<SubscribeButton />);

    const button = screen.getByTestId('SubscribeNow-button');

    fireEvent.click(button);

    await waitFor(() => expect(post).toHaveBeenCalledWith('subscriptions'));
    await waitFor(() =>
      expect(redirectToCheckout).toHaveBeenCalledWith({ sessionId })
    );
  });
});

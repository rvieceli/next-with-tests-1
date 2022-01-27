import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import { SubscribeButton } from './SubscribeButton';

jest.mock('next-auth/react');

jest.mock('next/router');

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
});

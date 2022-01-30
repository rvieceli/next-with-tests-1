import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/react';

import { SignInButton } from './SignInButton';

import { signOut } from 'app/services/nextAuth';

jest.mock('next-auth/react');

describe('SignInButton component', () => {
  it('renders SignIn when unauthenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignInButton />);

    const button = screen.getByRole('button', {
      name: /signin with github/i,
    });

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mocked(signIn)).toHaveBeenCalledWith('github');
  });

  it("renders user's name when authenticated", () => {
    const usersName = 'Some Name';

    mocked(useSession).mockReturnValueOnce({
      data: {
        user: { name: usersName },
        activeSubscription: null,
        expires: '',
      },
      status: 'authenticated',
    });

    render(<SignInButton />);

    const button = screen.getByRole('button', {
      name: new RegExp(usersName, 'i'),
    });

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mocked(signOut)).toHaveBeenCalled();
  });

  it('render anything when is loading', () => {
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'loading',
    });

    const { container } = render(<SignInButton />);

    expect(container.childElementCount).toBe(0);
  });
});

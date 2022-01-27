import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';

import { SignInButton } from './SignInButton';

jest.mock('next-auth/react');

describe('SignInButton component', () => {
  it('should render SignIn when unauthenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignInButton />);

    expect(screen.getByText('SignIn with GitHub')).toBeInTheDocument();
  });

  it("should render user's name when authenticated", () => {
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

    expect(screen.getByText(usersName)).toBeInTheDocument();
  });

  it('should not render anything when loading', () => {
    mocked(useSession).mockReturnValueOnce({
      data: null,
      status: 'loading',
    });

    const { container } = render(<SignInButton />);

    expect(container.childElementCount).toBe(0);
  });
});

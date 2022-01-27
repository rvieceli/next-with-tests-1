import { render, screen } from '@testing-library/react';
import { Header } from './Header';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}));

describe('Header component', () => {
  it('should render', () => {
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('SignIn with GitHub')).toBeInTheDocument();
  });
});

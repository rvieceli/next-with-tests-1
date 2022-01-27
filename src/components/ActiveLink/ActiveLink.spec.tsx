import { render, screen } from '@testing-library/react';
import { ActiveLink } from './ActiveLink';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

describe('ActiveLink component', () => {
  it('should render', () => {
    render(
      <ActiveLink href={'/'} activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should receive active class when active', () => {
    render(
      <ActiveLink href={'/'} activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText('Home')).toHaveClass('active');
  });
});

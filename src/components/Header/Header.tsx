import Image from 'next/image';

import { ActiveLink, SignInButton } from 'app/components';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/images/logo.svg"
          alt="ig.news"
          width={108.45}
          height={30.47}
        />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};

export { Header };

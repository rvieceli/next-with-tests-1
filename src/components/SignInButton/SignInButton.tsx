import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'app/services/nextAuth';

import styles from './SignInButton.module.scss';

const SignInButton = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (session) {
    return (
      <button
        type="button"
        className={styles.container}
        onClick={() => signOut()}
      >
        <FaGithub className={styles.loggedIn} />
        {session.user?.name}
        <FiX className={styles.closeIcon} />
      </button>
    );
  }

  return (
    <button type="button" className={styles.container} onClick={() => signIn()}>
      <FaGithub />
      SignIn with GitHub
    </button>
  );
};

export { SignInButton };

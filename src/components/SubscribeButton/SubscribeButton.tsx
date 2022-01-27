import { useRouter } from 'next/router';
import { api } from 'app/services/api';
import { useSession, signIn } from 'app/services/nextAuth';
import { getStripeJs } from 'app/services/stripe-js';
import styles from './SubscribeButton.module.scss';

const SubscribeButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      signIn();
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('subscriptions');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <button
      data-testid="SubscribeNow-button"
      type="button"
      className={styles.container}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  );
};

export { SubscribeButton };

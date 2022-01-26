import { useRouter } from 'next/router';
import { api } from 'services/api';
import { useSession, signIn } from 'services/nextAuth';
import { getStripeJs } from 'services/stripe-js';
import styles from './SubscribeButton.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
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
      type="button"
      className={styles.container}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  );
};

export { SubscribeButton };

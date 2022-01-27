import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';

import styles from './home.module.scss';

import { SubscribeButton } from 'app/components';
import { stripe } from 'app/services/stripe';

interface HomeProps {
  product: {
    amount: number;
    currency: string;
  };
}

const Home: NextPage<HomeProps> = ({ product }) => {
  const { amount, currency } = product;

  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>

      <main className={styles.container}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>
              for{' '}
              {Intl.NumberFormat(undefined, {
                style: 'currency',
                currency,
              }).format(amount)}{' '}
              per month
            </span>
          </p>

          <SubscribeButton />
        </section>
        <Image
          src="/images/avatar.svg"
          alt="Girl coding a React application"
          width="336"
          height="521"
        />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const priceId = process.env.STRIPE_PRICE_ID;

  const price = await stripe.prices.retrieve(priceId);

  const product = {
    amount: price.unit_amount! / 100,
    currency: price.currency,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export default Home;

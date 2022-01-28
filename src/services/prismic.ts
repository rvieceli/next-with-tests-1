import Prismic from '@prismicio/client';

const getPrismicClient = (req?: unknown) => {
  const prismic = Prismic.client(process.env.PRISMIC_URL, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });

  return prismic;
};

export { getPrismicClient, Prismic };

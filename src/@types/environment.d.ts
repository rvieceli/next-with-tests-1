namespace NodeJS {
  interface ProcessEnv {
    VERCEL_URL: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string;
    STRIPE_PRICE_ID: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    FAUNA_SECRET: string;
    FAUNA_DOMAIN?: string;
    PRISMIC_ACCESS_TOKEN: string;
    PRISMIC_URL: string;
  }
}

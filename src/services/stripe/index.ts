import Stripe from "stripe";
import packageJson from "../../../package.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    name: "ig.news",
    version: packageJson.version,
  },
});

export { stripe };
